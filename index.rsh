'reach 0.1';

const [ isHand, ROCK, PAPER, SCISSORS ] = makeEnum(3);
const [ isOutcome, B_WINS, DRAW, A_WINS ] = makeEnum(3);

const winner = (handFundRaiser, handBob) =>
  ((handFundRaiser + (4 - handBob)) % 3);

assert(winner(ROCK, PAPER) == B_WINS);
assert(winner(PAPER, ROCK) == A_WINS);
assert(winner(ROCK, ROCK) == DRAW);

forall(UInt, handFundRaiser =>
  forall(UInt, handBob =>
    assert(isOutcome(winner(handFundRaiser, handBob)))));

forall(UInt, (hand) =>
  assert(winner(hand, hand) == DRAW));

const Player = {
  ...hasRandom,
  getHand: Fun([], UInt),
  seeOutcome: Fun([UInt], Null),
  informTimeout: Fun([], Null),
};

export const main = Reach.App(() => {
  const FundRaiser = Participant('FundRaiser', {
    ...Player,
    closeOrRefund: Fun([], UInt),
    projectName: Bytes(16),
    projectDescription: Bytes(30),
    wager: UInt, // atomic units of currency
    deadline: UInt, // time delta (blocks/rounds)
  });
  const Bob   = Participant('Bob', {
    ...Player,
    acceptWager: Fun([Bytes(16), Bytes(30), UInt], Null),
  });
  init();

  const informTimeout = () => {
    each([FundRaiser, Bob], () => {
      interact.informTimeout();
    });
  };

  FundRaiser.only(() => {
    const projectName = declassify(interact.projectName);
    const projectDescription = declassify(interact.projectDescription);
    const wager = declassify(interact.wager);
    const deadline = declassify(interact.deadline);
  });
  FundRaiser.publish(projectName, projectDescription, wager, deadline)
    .pay(wager);
  commit();

  Bob.only(() => {
    interact.acceptWager(projectName, projectDescription, wager);
  });
  Bob.pay(wager)
    .timeout(relativeTime(deadline), () => closeTo(FundRaiser, informTimeout));

  var outcome = DRAW;
  invariant( balance() == 2 * wager && isOutcome(outcome) );
  while ( outcome == DRAW ) {
    commit();

    FundRaiser.only(() => {
      const _handFundRaiser = interact.closeOrRefund();
      const commitFundRaiser = declassify(_handFundRaiser);
    });
    FundRaiser.publish(commitFundRaiser)
      .timeout(relativeTime(deadline), () => closeTo(Bob, informTimeout));

    if (commitFundRaiser === B_WINS) {
      outcome = B_WINS;
      continue;
    }

    if (commitFundRaiser === A_WINS) {
      outcome = A_WINS;
      continue;
    }

    continue;
  }

  assert(outcome == A_WINS || outcome == B_WINS);
  transfer(2 * wager).to(outcome == A_WINS ? FundRaiser : Bob);
  commit();

  each([FundRaiser, Bob], () => {
    interact.seeOutcome(outcome);
  });
});
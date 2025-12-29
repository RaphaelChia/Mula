/*
#[test_only]
module contract::contract_tests;
// uncomment this line to import the module
// use contract::contract;

const ENotImplemented: u64 = 0;

#[test]
fun test_contract() {
    // pass
}

#[test, expected_failure(abort_code = ::contract::contract_tests::ENotImplemented)]
fun test_contract_fail() {
    abort ENotImplemented
}
*/

module mula::poll_tests;

use mula::Poll;
use std::unit_test;
use sui::clock::{Self, Clock};
use sui::test_scenario::{Self as ts, Scenario};

#[test]
public fun test_create_poll() {
    let (grabbed_poll, scenario) = init_test_with_poll(@0xA11ce);

    assert!(grabbed_poll.name() == b"Test Poll".to_string(), 0);
    assert!(grabbed_poll.options().length() == 2, 0);
    assert!(grabbed_poll.creator() == @0xA11ce, 0);
    assert!(grabbed_poll.ended() == false, 0);
    assert!(grabbed_poll.votes().length() == 2, 0);
    assert!(grabbed_poll.voters().length() == 0, 0);
    cleanup(scenario, grabbed_poll);
}

#[test]
public fun test_vote() {
    let (mut grabbed_poll, mut scenario) = init_test_with_poll(@0xA11ce);
    scenario.next_tx(@0xb0b);
    grabbed_poll.vote(0, scenario.ctx());
    assert!(grabbed_poll.votes()[0]==1, 0);
    assert!(grabbed_poll.voters().contains(&@0xb0b), 0);
    cleanup(scenario, grabbed_poll);
}

#[test]
#[expected_failure(abort_code = Poll::EPollEnded)]
public fun test_vote_after_poll_ended() {
    let (mut grabbed_poll, mut scenario) = init_test_with_poll(@0xA11ce);
    scenario.next_tx(@0xA11ce);
    grabbed_poll.end_poll(scenario.ctx());
    grabbed_poll.vote(0, scenario.ctx());
    abort
}

#[test]
#[expected_failure(abort_code = Poll::EOptionOutOfBounds)]
public fun test_vote_with_invalid_option() {
    let (mut grabbed_poll, mut scenario) = init_test_with_poll(@0xA11ce);
    scenario.next_tx(@0xA11ce);
    grabbed_poll.vote(2, scenario.ctx());
    abort
}

#[test]
#[expected_failure(abort_code = Poll::EVoterAlreadyVoted)]
public fun test_vote_by_same_voter_twice() {
    let (mut grabbed_poll, mut scenario) = init_test_with_poll(@0xA11ce);
    scenario.next_tx(@0xA11ce);
    grabbed_poll.vote(0, scenario.ctx());
    grabbed_poll.vote(0, scenario.ctx());
    abort
}

#[test]
#[expected_failure(abort_code = Poll::ENotPollCreator)]
public fun test_end_poll_by_non_creator() {
    let (mut grabbed_poll, mut scenario) = init_test_with_poll(@0xA11ce);
    scenario.next_tx(@0xb0b);
    grabbed_poll.end_poll(scenario.ctx());
    abort
}

#[test]
public fun test_end_poll() {
    let (mut grabbed_poll, mut scenario) = init_test_with_poll(@0xA11ce);
    scenario.next_tx(@0xA11ce);
    grabbed_poll.end_poll(scenario.ctx());
    assert!(grabbed_poll.ended() == true, 0);
    cleanup(scenario, grabbed_poll);
}

#[test_only]
fun init_test_with_poll(sender: address): (Poll::Poll, Scenario) {
    let mut scenario = ts::begin(sender);
    let poll_options = vector[b"Option 1".to_string(), b"Option 2".to_string()];

    let clock = sui::clock::create_for_testing(scenario.ctx());
    Poll::create_poll(b"Test Poll".to_string(), poll_options, &clock, scenario.ctx());
    scenario.next_tx(@0xA11ce);
    unit_test::destroy(clock);
    (scenario.take_shared<Poll::Poll>(), scenario)
}

#[test_only]
fun cleanup(scenario: Scenario, poll: Poll::Poll) {
    unit_test::destroy(poll);
    ts::end(scenario);
}

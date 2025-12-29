/*
/// Module: contract
module mula::poll;
*/

// For Move coding conventions, see
// https://docs.sui.io/concepts/sui-move-concepts/conventions

module mula::Poll;

use std::string::String;
use sui::clock::{Self, timestamp_ms, Clock};

const EOptionOutOfBounds: u64 = 1;
const EPollEnded: u64 = 2;
const EVoterAlreadyVoted: u64 = 3;
const ENotPollCreator: u64 = 4;

public struct Poll has key {
    id: UID,
    options: vector<String>,
    name: String,
    votes: vector<u64>,
    creator: address,
    created_at: u64,
    voters: vector<address>,
    ended: bool,
}

public fun create_poll(name: String, options: vector<String>, clock: &Clock, ctx: &mut TxContext) {
    let mut votes_vector: vector<u64> = vector::empty();
    while (votes_vector.length() < options.length()) {
        votes_vector.push_back(0);
    };
    let poll = Poll {
        id: object::new(ctx),
        options: options,
        name: name,
        votes: votes_vector,
        creator: ctx.sender(),
        created_at: clock::timestamp_ms(clock),
        voters: vector::empty(),
        ended: false,
    };
    transfer::share_object(poll);
}

public fun vote(poll: &mut Poll, option: u64, ctx: &mut TxContext) {
    assert!(option < poll.options.length(), EOptionOutOfBounds);
    assert!(poll.ended == false, EPollEnded);
    assert!(!vector::contains<address>(&poll.voters, &ctx.sender()), EVoterAlreadyVoted);
    let count = vector::borrow_mut(&mut poll.votes, option);
    *count = *count + 1;
    vector::push_back(&mut poll.voters, ctx.sender());
}

public fun end_poll(poll: &mut Poll, ctx: &mut TxContext) {
    assert!(poll.creator == ctx.sender(), ENotPollCreator);
    poll.ended = true;
}

// Add these getter functions after your existing functions

public fun name(poll: &Poll): String {
    poll.name
}

public fun options(poll: &Poll): vector<String> {
    poll.options
}

public fun votes(poll: &Poll): vector<u64> {
    poll.votes
}

public fun creator(poll: &Poll): address {
    poll.creator
}

public fun voters(poll: &Poll): vector<address> {
    poll.voters
}

public fun ended(poll: &Poll): bool {
    poll.ended
}

// public fun view(
//     poll: &Poll,
// ): (String, vector<String>, vector<u64>, address, vector<address>, bool) {
//     (poll.name, poll.options, poll.votes, poll.creator, poll.voters, poll.ended)
// }

/*
/// Module: contract
module mula::poll;
*/

// For Move coding conventions, see
// https://docs.sui.io/concepts/sui-move-concepts/conventions


module mula::poll {

    use std::string::String;


    const EOptionOutOfBounds: u64 = 1;
    const EPollEnded: u64 = 2;
    const EVoterAlreadyVoted: u64 = 3;
    const ENotPollCreator: u64 = 4;

    public struct Poll has key {
        id: UID,
        options: vector<String>,
        votes: vector<u64>,
        creator: address,
        voters: vector<address>,
        ended: bool,
    }

    public fun create_poll(ctx: &mut TxContext, options: vector<String>){
        let poll = Poll {
            id: object::new(ctx),
            options: options,
            votes: vector::empty(),
            creator: ctx.sender(),
            voters: vector::empty(),
            ended: false,
        };
        transfer::share_object(poll);
    }

    public fun vote(poll: &mut Poll, option: u64, ctx: &mut TxContext){
        assert!(option < poll.options.length(), EOptionOutOfBounds);
        assert!(poll.ended == false, EPollEnded);
        assert!(!vector::contains<address>(&poll.voters, &ctx.sender()), EVoterAlreadyVoted);
        let count = vector::borrow_mut(&mut poll.votes, option);
        *count = *count + 1;
        vector::push_back(&mut poll.voters, ctx.sender());
    }

    public fun end_poll(poll: &mut Poll, ctx: &mut TxContext){
        assert!(poll.creator == ctx.sender(), ENotPollCreator);
        poll.ended = true;
    }
}
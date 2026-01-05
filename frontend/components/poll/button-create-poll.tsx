'use client';
import FormPollCreateOptions from '@/components/poll/form-poll-create-options';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { useState } from 'react';

const ButtonCreatePoll = () => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="">
          <span className="max-sm:hidden">Create poll</span>
          <span className="flex items-center gap-1 sm:hidden">
            <Plus className="size-4" />
            Poll
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New poll</DialogTitle>
          <DialogDescription>
            Create a new poll to collect votes from your community.
          </DialogDescription>
        </DialogHeader>
        <FormPollCreateOptions
          onSuccess={() => {
            setOpen(false);
          }}
          onFailure={() => {
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ButtonCreatePoll;

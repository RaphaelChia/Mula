import FormPollCreateOptions from '@/components/poll/form-poll-create-options';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';

const ButtonCreatePoll = () => {
  return (
    <Dialog>
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
        <FormPollCreateOptions />
        <DialogFooter>
          <Button type="submit" form="poll-options-form">
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ButtonCreatePoll;

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

const ButtonCreatePoll = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="">Create poll</Button>
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

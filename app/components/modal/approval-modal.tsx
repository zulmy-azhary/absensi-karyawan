import { Button } from "~/components/ui/button";
import { Check } from "lucide-react";
import { AlertDialog, AlertDialogContent, AlertDialogTrigger } from "~/components/ui/alert-dialog";
import { ApprovalForm } from "~/components/form/approval-form";

type ApprovalModalProps = {
  absence: any;
};

export const ApprovalModal = ({ absence }: ApprovalModalProps) => {

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="primary" className="p-3">
          <Check className="w-5 h-5" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <ApprovalForm absence={absence} />
      </AlertDialogContent>
    </AlertDialog>
  );
};

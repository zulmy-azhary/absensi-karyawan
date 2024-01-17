import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import type { ActionType } from "~/types";

type ModalProps = React.PropsWithChildren<{
  renderButton: React.ReactNode;
  title: React.ReactNode;
  action?: ActionType;
}>;

export default function Modal(props: ModalProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{props.renderButton}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader className="gap-y-2">
          <AlertDialogTitle className="text-center">{props.title}</AlertDialogTitle>
            {props.children}
        </AlertDialogHeader>
        <AlertDialogFooter className="justify-center">
          <AlertDialogCancel>Batal</AlertDialogCancel>
          {props.action !== "DETAIL" ? (
            <AlertDialogAction type="submit" name="_action" value={props.action}>
              {props.action === "UPDATE" ? "Ubah" : "Hapus"}
            </AlertDialogAction>
          ) : null}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

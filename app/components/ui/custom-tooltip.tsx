import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";

type CustomTooltipProps = React.PropsWithChildren<{
  title: string;
}>;

export default function CustomTooltip(props: CustomTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{props.children}</TooltipTrigger>
        <TooltipContent>
          <p>{props.title}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

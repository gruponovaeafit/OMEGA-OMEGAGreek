import { IconName } from "@/app/types/IconName.type";
import Icon from "./Icon";

interface FormStaticAlertProps {
  iconName: IconName
  children: React.ReactNode;
}

export default function FormStaticAlert({children, iconName}: FormStaticAlertProps) {
  return (
    <article className="relative border-2 border-gray rounded-xl pt-12 pb-3 px-3 bg-white/40 backdrop-blur-md">
      <Icon
        name={iconName}
        className="absolute left-1/2 -translate-x-1/2 -top-11"
      />
      {children}
    </article>
  );
}
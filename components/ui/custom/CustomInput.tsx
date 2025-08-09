import { forwardRef } from "react";
import { Input } from "../input";
import { Button } from "react-day-picker";

export const CustomInput = forwardRef<HTMLDivElement, { value: string; onClick: () => void; onConfirm: () => void }>(
    ({ value, onClick, onConfirm }, ref) => (
      <div ref={ref} className="relative">
        <Input value={value} onClick={onClick} readOnly className="w-full" />
        <Button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onConfirm();
          }}
          className="absolute right-[-100px] top-0 bottom-0"
        >
          Готово
        </Button>
      </div>
    )
  );
  
  CustomInput.displayName = 'CustomInput';
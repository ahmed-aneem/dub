import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../command";
import { cn } from "../../utils";

export interface ComboboxOption {
  value: string;
  label: string;
  icon?: ReactNode;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  selected: string | string[];
  onSelect: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
  preserveOrder?: boolean;
}

export function Combobox({
  options,
  selected,
  onSelect,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  emptyMessage = "No results found.",
  className,
  preserveOrder = false,
}: ComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldSortOptions, setShouldSortOptions] = useState(true);

  // Mark shouldSortOptions = true when options, selected, or isOpen/closed state changes appropriately
  useEffect(() => {
    if (!isOpen) {
      setShouldSortOptions(true);
    }
  }, [options, selected, isOpen]);

  const sortOptions = useCallback(
    (opts: ComboboxOption[]) => {
      if (preserveOrder || !shouldSortOptions) {
        return opts;
      }
      const selectedArray = Array.isArray(selected) ? selected : [selected];
      return [...opts].sort((a, b) => {
        const aIndex = selectedArray.indexOf(a.value);
        const bIndex = selectedArray.indexOf(b.value);
        if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
        if (aIndex !== -1) return -1;
        if (bIndex !== -1) return 1;
        return 0;
      });
    },
    [preserveOrder, shouldSortOptions, selected]
  );

  const sortedOptions = useMemo(() => {
    return sortOptions(options);
  }, [options, sortOptions]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button className={cn("flex items-center justify-between w-full px-3 py-2 text-sm border rounded-md", className)}>
          <span>{placeholder}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {sortedOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => {
                    onSelect(option.value);
                    setShouldSortOptions(false);
                  }}
                >
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

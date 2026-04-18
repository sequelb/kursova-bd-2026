import { useState } from 'react'
import { Check, ChevronDown, X } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from './ui/command'
import type { Category } from '../../lib/api'

type Props = {
  categories: Category[]
  selected: number[]
  onChange: (ids: number[]) => void
  placeholder?: string
}

export function CategoryMultiSelect({
  categories,
  selected,
  onChange,
  placeholder = 'Select categories…',
}: Props) {
  const [open, setOpen] = useState(false)

  const selectedSet = new Set(selected)
  const selectedCategories = categories.filter((c) => selectedSet.has(c.id))

  function toggle(id: number) {
    if (selectedSet.has(id)) {
      onChange(selected.filter((x) => x !== id))
    } else {
      onChange([...selected, id])
    }
  }

  function remove(id: number) {
    onChange(selected.filter((x) => x !== id))
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="w-full flex items-center gap-2 px-3 py-2 border-2 border-gray-800 bg-white text-left min-h-[42px] flex-wrap"
        >
          {selectedCategories.length === 0 ? (
            <span className="text-gray-500 text-sm">{placeholder}</span>
          ) : (
            <div className="flex flex-wrap gap-1 flex-1">
              {selectedCategories.map((c) => (
                <span
                  key={c.id}
                  className="inline-flex items-center gap-1 px-2 py-0.5 border-2 border-gray-800 bg-gray-900 text-white text-xs font-bold"
                >
                  {c.name}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      remove(c.id)
                    }}
                    className="hover:text-gray-300"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
          <ChevronDown className="w-4 h-4 text-gray-500 ml-auto flex-shrink-0" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search categories…" />
          <CommandList>
            <CommandEmpty>No categories found.</CommandEmpty>
            {categories.map((c) => {
              const isSelected = selectedSet.has(c.id)
              return (
                <CommandItem
                  key={c.id}
                  value={c.name}
                  onSelect={() => toggle(c.id)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <div
                    className={`w-4 h-4 border-2 border-gray-800 flex items-center justify-center flex-shrink-0 ${
                      isSelected ? 'bg-gray-900' : 'bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span>{c.name}</span>
                </CommandItem>
              )
            })}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

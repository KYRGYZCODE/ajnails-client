/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from 'react'
import Image from 'next/image'

interface Master {
  uuid: string
  name: string
  avatar: string | null
  available_slots: string[]
}

interface SlotsData {
  date: string
  service_id: string
  is_long_service: boolean
  masters: Master[]
}

interface Props {
  loading: boolean
  slots: SlotsData | null
  /** time может быть null, когда выбираем только мастера */
  onSelect: (master: Master | null, time: string | null) => void
}

/* … остальные типы остаются без изменений … */

export default function MasterList({ loading, slots, onSelect }: Props) {
  const [selectedMaster, setSelectedMaster] = useState<Master | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)

  if (loading || !slots) return <div className="p-4 text-center">Загружаю…</div>

  const isLong = slots.is_long_service

  /* выносим в useCallback во избежание лишних перерендеров */
  const chooseMaster = React.useCallback((master: Master) => {
    setSelectedMaster(master)
    setSelectedSlot(null)
    if (isLong) onSelect(master, null)
  }, [isLong, onSelect])

  const chooseSlot = React.useCallback((master: Master, time: string) => {
    setSelectedMaster(master)
    setSelectedSlot(time)
    onSelect(master, time)
  }, [onSelect])

  /* хелпер для группировки слотов */
  const splitSlots = React.useCallback((list: string[]) => {
    const day: string[] = []
    const evening: string[] = []

    list
      .slice()                                // копия, чтобы не мутировать исходник
      .sort((a, b) => a.localeCompare(b))     // сортируем по времени
      .forEach((t) => {
        const hour = parseInt(t.slice(0, 2), 10)
        ;(hour < 18 ? day : evening).push(t)  // < 18-00 — “день”, иначе “вечер”
      })

    return { day, evening }
  }, [])

  return (
    <div className="space-y-6 my-5">
      {slots.masters.map((m) => {
        const { day, evening } = React.useMemo(() => splitSlots(m.available_slots), [
          m.available_slots,
          splitSlots,
        ])

        return (
          <div key={m.uuid} className="space-y-4">
            {/* карточка мастера */}
            <label className="flex items-center gap-4 cursor-pointer">
              {m.avatar ? (
                <Image
                  src={m.avatar}
                  alt={m.name}
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
              ) : (
                <span className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-lg">
                  {m.name[0]}
                </span>
              )}

              <div className="flex-1">
                <p className="text-lg font-medium">{m.name}</p>
                <p className="text-sm text-gray-500">мастер</p>
              </div>

              <input
                type="radio"
                name="master"
                className="h-5 w-5 accent-primary"
                checked={selectedMaster?.uuid === m.uuid}
                onChange={() => chooseMaster(m)}
              />
            </label>

            {/* Слоты показываем только если услуга короткая */}
            {!isLong && (
              <>
                {day.length > 0 && (
                  <>
                    <p className="mt-2 font-medium text-gray-600">День</p>
                    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
                      {day.map((t) => (
                        <SlotButton
                          key={t}
                          time={t}
                          active={selectedMaster?.uuid === m.uuid && selectedSlot === t}
                          onClick={() => chooseSlot(m, t)}
                        />
                      ))}
                    </div>
                  </>
                )}

                {evening.length > 0 && (
                  <>
                    <p className="mt-4 font-medium text-gray-600">Вечер</p>
                    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
                      {evening.map((t) => (
                        <SlotButton
                          key={t}
                          time={t}
                          active={selectedMaster?.uuid === m.uuid && selectedSlot === t}
                          onClick={() => chooseSlot(m, t)}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}

/* Выносим кнопку в отдельный компонент ради читаемости */
const SlotButton = ({
  time,
  active,
  onClick,
}: {
  time: string
  active: boolean
  onClick: () => void
}) => (
  <button
    onClick={onClick}
    className={`w-full rounded-full py-2 text-sm text-center transition 
      ${active ? 'text-white bg-black' : 'bg-gray-200'}`}
  >
    {time}
  </button>
)

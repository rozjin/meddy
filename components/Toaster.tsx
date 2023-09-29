import { Toaster, resolveValue } from "react-hot-toast"

import { Card, Spinner } from "@nextui-org/react"
import { RiCheckLine, RiAlertLine, RiInformationLine, RiArrowTurnBackLine } from 'react-icons/ri'

export default () => {
  return (
    <Toaster>
      {(t) => (
        <Card className="flex flex-row items-center p-2 text-purple-800 transition delay-200 bg-white rounded-md shadow-md">
          {{
            'success': <RiCheckLine className="w-8 h-8 p-1 rounded-lg bg-purple-50 shadow-sm" />,
            'error': <RiAlertLine className="w-8 h-8 p-1 rounded-lg bg-purple-50 shadow-sm" />,

            'loading': <RiArrowTurnBackLine className="w-8 h-8 p-1 rounded-lg bg-purple-50 shadow-sm" />,
            
            'blank': <RiInformationLine className="w-8 h-8 p-1 rounded-lg bg-purple-50 shadow-sm" />,
            'custom': <RiInformationLine className="w-8 h-8 p-1 rounded-lg bg-purple-50 shadow-sm" />
          }[t.type]}
          <span className="ml-2">{resolveValue(t.message, t)}</span>
        </Card>
      )}
      </Toaster>
    )
}
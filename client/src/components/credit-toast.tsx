import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

interface CuteMessage {
  character: string;
  message: string;
}

interface CreditToastProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreditToast({ isOpen, onClose }: CreditToastProps) {
  const { data: cuteMessage } = useQuery<CuteMessage>({
    queryKey: ["/api/usage/cute-message"],
    enabled: isOpen, // Only fetch when toast is shown
  });

  if (!isOpen || !cuteMessage) return null;

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50" data-testid="toast-credit-exhausted">
      <div className="bg-white rounded-2xl p-6 gentle-shadow border-l-4 border-warning max-w-lg mx-4 toast-enter toast-enter-active">
        <div className="flex items-start">
          <div className="text-3xl mr-4 character-bounce" data-testid="toast-character">
            {cuteMessage.character}
          </div>
          <div className="flex-1">
            <div className="font-medium text-gray-800 mb-3 font-korean leading-relaxed" data-testid="toast-message">
              {cuteMessage.message.split('\n').map((line, index) => (
                <div key={index} className={index > 0 ? "mt-1" : ""}>
                  {line}
                </div>
              ))}
            </div>
            <div className="text-sm text-gray-600 flex items-center font-korean bg-gray-50 rounded-lg p-2">
              <span className="mr-1">⏰</span>
              내일 오전 5시 이후 다시 이용하실 수 있어요!
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 ml-2 p-1"
            data-testid="button-close-toast"
          >
            <span className="text-xl">×</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

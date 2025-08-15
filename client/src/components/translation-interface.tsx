import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { CreditToast } from "./credit-toast";
import type { TranslateRequest } from "@shared/schema";

interface TranslationResponse {
  translation: string;
  emotionalFocus: string;
  heartInterpretation?: string;
  usedAI: boolean;
  hasCapacity: boolean;
  capacityExhausted: boolean;
  currentCount: number;
  maxUsers: number;
  cuteMessage?: string;
}

interface UsageStatus {
  hasCapacity: boolean;
  usersCount: number;
  maxUsers: number;
  remaining: number;
}

export function TranslationInterface() {
  const [inputText, setInputText] = useState("");
  const [showCapacityToast, setShowCapacityToast] = useState(false);
  const [translationResult, setTranslationResult] = useState<TranslationResponse | null>(null);
  const { toast } = useToast();

  // Check usage status
  const { data: usageStatus } = useQuery<UsageStatus>({
    queryKey: ["/api/usage/check"],
    refetchInterval: 30000, // Check every 30 seconds
  });

  // Translation mutation
  const translateMutation = useMutation({
    mutationFn: async (data: TranslateRequest) => {
      const response = await apiRequest("POST", "/api/translate", data);
      return response.json();
    },
    onSuccess: (data: TranslationResponse) => {
      setTranslationResult(data);
      if (data.capacityExhausted && data.cuteMessage) {
        // Show cute exhausted message
        toast({
          title: "🎭 AI 요정이 잠시 쉬는 중이에요",
          description: data.cuteMessage,
          duration: 8000,
        });
      }
      // Invalidate usage status to get updated info
      queryClient.invalidateQueries({ queryKey: ["/api/usage/check"] });
    },
    onError: (error) => {
      toast({
        title: "번역 실패",
        description: "번역 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    },
  });

  const handleTranslate = () => {
    if (!inputText.trim()) {
      toast({
        title: "입력 오류",
        description: "번역할 문장을 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    if (inputText.length > 500) {
      toast({
        title: "입력 오류", 
        description: "문장이 너무 깁니다. 500자 이내로 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    translateMutation.mutate({ koreanText: inputText });
  };

  return (
    <>
      <div className="bg-white rounded-3xl p-8 gentle-shadow mb-8">
        {/* Input Section */}
        <div className="mb-6">
          <label htmlFor="korean-input" className="block text-sm font-medium text-gray-700 mb-3 flex items-center font-korean">
            다정한 번역을 의뢰하세요
          </label>
          <div className="relative">
            <Textarea
              id="korean-input"
              placeholder="예: 어제 언니가 저한테 '이건 대체 왜 이렇게밖에 못하냐'고 말했어요.
기분이 너무 상했는데… 혹시 이 말의 진심은 뭐였을까요?"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-primary focus:ring-0 resize-none transition-colors duration-200 font-korean text-lg min-h-[120px]"
              maxLength={500}
              data-testid="input-korean"
            />
            <div className="absolute bottom-3 right-3 text-sm text-gray-400">
              <span data-testid="text-character-count">{inputText.length}</span>/500
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="text-center mb-6">
          <Button
            onClick={handleTranslate}
            disabled={translateMutation.isPending}
            className="px-8 py-4 bg-gradient-to-r from-primary to-purple-600 text-white rounded-2xl font-medium text-lg hover:from-purple-600 hover:to-primary transition-all duration-200 gentle-shadow transform hover:scale-105 font-korean"
            data-testid="button-translate"
          >
            <span className="mr-2">💫</span>
            {translateMutation.isPending ? "번역 중..." : "다정한 번역하기"}
          </Button>
        </div>

        {/* Results Section */}
        {translationResult && (
          <div className="space-y-6 mb-6" data-testid="translation-results">
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <span className="text-2xl mr-3">💝</span>
                  <h3 className="text-lg font-semibold text-gray-800 font-korean">다정한 번역 결과</h3>
                  {translationResult.usedAI && (
                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-korean">
                      AI 번역
                    </span>
                  )}
                </div>
                <div className="bg-white rounded-xl p-4 mb-4">
                  <p className="text-gray-800 font-korean text-lg leading-relaxed" data-testid="text-translation">
                    {translationResult.translation}
                  </p>
                </div>
                <div className="bg-white rounded-xl p-4 space-y-3">
                  <p className="text-sm text-gray-600 flex items-center font-korean">
                    <span className="mr-2">💡</span>
                    <span className="font-medium">감정적 초점:</span>
                    <span className="ml-2" data-testid="text-emotional-focus">{translationResult.emotionalFocus}</span>
                  </p>
                  {translationResult.heartInterpretation && (
                    <p className="text-sm text-gray-600 flex items-center font-korean">
                      <span className="mr-2">💖</span>
                      <span className="font-medium">마음의 요약:</span>
                      <span className="ml-2 italic" data-testid="text-heart-interpretation">"{translationResult.heartInterpretation}"</span>
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Usage Status Display */}
        <div className="mb-6" data-testid="usage-status">
          {usageStatus?.hasCapacity ? (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4 flex items-center">
              <span className="text-2xl mr-3">✨</span>
              <div>
                <p className="text-green-800 font-medium font-korean">AI 감성 분석 가능</p>
                <p className="text-green-600 text-sm font-korean">
                  오늘 번역 사용: {usageStatus.usersCount} / {usageStatus.maxUsers}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-2xl p-4 flex items-center">
              <span className="text-2xl mr-3">😴</span>
              <div>
                <p className="text-orange-800 font-medium font-korean">일일 AI 사용량 초과</p>
                <p className="text-orange-600 text-sm font-korean">부드러운 번역 알고리즘으로 제공됩니다</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Capacity Exhausted Toast */}
      <CreditToast 
        isOpen={showCapacityToast} 
        onClose={() => setShowCapacityToast(false)} 
      />
    </>
  );
}

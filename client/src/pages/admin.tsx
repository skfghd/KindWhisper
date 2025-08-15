import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Footer } from "@/components/footer";
import { Link } from "wouter";

interface UsageStats {
  date: string;
  usersCount: number;
  maxUsers: number;
  utilizationRate: string;
  resetTime: string;
}

export default function AdminPage() {
  const { data: usageStats, isLoading } = useQuery<UsageStats>({
    queryKey: ["/api/admin/usage-stats"],
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl character-bounce" data-testid="header-icon">📊</span>
            <h1 className="text-xl font-bold text-gray-800 font-korean" data-testid="header-title">다정한 번역기 관리자</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/">
              <a className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 border border-gray-200"
                 data-testid="link-home-admin">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-600">
                  <path d="M3 9.5L12 3L21 9.5V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V9.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 21V12H15V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="font-medium font-korean text-sm">메인으로</span>
              </a>
            </Link>
            <a 
              href="https://kindtool.ai/" 
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 border border-gray-200"
              data-testid="link-kindtool-admin"
            >
              <span>🏠</span>
              <span className="font-medium font-korean text-sm">홈으로</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 font-korean">일일 사용량 모니터링</h2>
          <p className="text-gray-600 font-korean">AI 번역 서비스의 실시간 이용 현황을 확인하세요</p>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600 font-korean">데이터를 불러오는 중...</p>
          </div>
        ) : usageStats ? (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Current Usage */}
            <Card className="bg-white gentle-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 font-korean">
                  <span className="text-2xl">👥</span>
                  <span>현재 사용량</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2" data-testid="text-current-usage">
                    {usageStats.usersCount}
                  </div>
                  <div className="text-gray-600 font-korean">
                    {usageStats.maxUsers}명 중
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
                    <div 
                      className="bg-gradient-to-r from-primary to-purple-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${(usageStats.usersCount / usageStats.maxUsers) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-500 mt-2 font-korean">
                    사용률: {usageStats.utilizationRate}%
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System Info */}
            <Card className="bg-white gentle-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 font-korean">
                  <span className="text-2xl">⚙️</span>
                  <span>시스템 정보</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 font-korean">오늘 날짜:</span>
                  <span className="font-medium" data-testid="text-current-date">{usageStats.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-korean">일일 제한:</span>
                  <span className="font-medium">{usageStats.maxUsers}명</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-korean">리셋 시간:</span>
                  <span className="font-medium font-korean">{usageStats.resetTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-korean">남은 슬롯:</span>
                  <span className="font-medium text-green-600">{usageStats.maxUsers - usageStats.usersCount}개</span>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 font-korean">데이터를 불러올 수 없습니다.</p>
          </div>
        )}

        {/* Status Indicator */}
        <div className="text-center">
          {usageStats && (
            <div className={`inline-flex items-center px-6 py-3 rounded-full ${
              usageStats.usersCount >= usageStats.maxUsers 
                ? 'bg-red-50 border border-red-200 text-red-800' 
                : usageStats.usersCount >= usageStats.maxUsers * 0.8
                ? 'bg-yellow-50 border border-yellow-200 text-yellow-800'
                : 'bg-green-50 border border-green-200 text-green-800'
            }`}>
              <span className="text-xl mr-2">
                {usageStats.usersCount >= usageStats.maxUsers 
                  ? '🔴' 
                  : usageStats.usersCount >= usageStats.maxUsers * 0.8
                  ? '🟡'
                  : '🟢'
                }
              </span>
              <span className="font-medium font-korean">
                {usageStats.usersCount >= usageStats.maxUsers 
                  ? 'AI 서비스 일시 중단 (Fallback 모드)' 
                  : usageStats.usersCount >= usageStats.maxUsers * 0.8
                  ? 'AI 서비스 곧 마감 예정'
                  : 'AI 서비스 정상 운영 중'
                }
              </span>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
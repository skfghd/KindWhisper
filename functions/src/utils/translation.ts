export interface FallbackTranslationResult {
  translation: string;
  emotionalFocus: string;
}

export function fallbackTranslation(koreanText: string): FallbackTranslationResult {
  // Enhanced Korean emotional patterns for gentle reexpression
  const emotionalPatterns = [
    { pattern: /너는 왜 그것도 못참니|왜 그렇게밖에 못하냐|그렇게밖에 못하겠냐/i, replacement: "그게 참 힘들었겠구나", focus: "비난을 이해와 공감으로 변환" },
    { pattern: /이건 대체 왜 이렇게밖에 못하냐/i, replacement: "이 일이 생각보다 어려웠나 보네", focus: "실망을 이해로 바꾸기" },
    { pattern: /짜증나|화나|열받아/i, replacement: "마음이 많이 상했구나", focus: "화난 감정을 부드럽게 달래기" },
    { pattern: /싫어|별로야|싫다/i, replacement: "마음에 잘 안 들 수도 있지", focus: "거부감을 부드럽게 표현" },
    { pattern: /못생겼어|추해/i, replacement: "각자의 매력이 있는 거야", focus: "외모 비하를 긍정으로 전환" },
    { pattern: /바보야|멍청해|stupid/i, replacement: "아직 익숙하지 않은 거겠지", focus: "지능 비하를 이해로 바꾸기" },
    { pattern: /하지마|그만해|stop/i, replacement: "잠깐 쉬어가도 괜찮아", focus: "명령을 부드러운 제안으로" },
    { pattern: /고생했어요|수고했어요/i, replacement: "정말 많이 애썼구나", focus: "인정과 격려의 따뜻한 마음" },
    { pattern: /고마워요|감사해요|고맙습니다/i, replacement: "마음 깊이 고마워", focus: "진심 어린 감사와 고마움" },
    { pattern: /사랑해요|사랑해/i, replacement: "정말 소중한 사람이야", focus: "깊은 애정과 따뜻한 사랑" },
    { pattern: /보고 싶어요|그리워요/i, replacement: "떠올릴 때마다 마음이 따뜻해져", focus: "그리움과 애틋한 마음" },
    { pattern: /미안해요|죄송해요|미안합니다/i, replacement: "마음이 무거웠구나", focus: "진심 어린 사과와 반성" },
    { pattern: /괜찮아요|괜찮습니다/i, replacement: "모든 게 잘 풀릴 거야", focus: "따뜻한 위로와 이해" },
    { pattern: /힘내요|힘내세요|화이팅/i, replacement: "네가 할 수 있다는 걸 알고 있어", focus: "응원과 희망의 메시지" },
    { pattern: /푹 쉬세요|쉬어요/i, replacement: "마음 편히 쉬어도 돼", focus: "따뜻한 배려와 위로" },
    { pattern: /행복해요|기뻐요/i, replacement: "마음이 따뜻해 보여서 좋다", focus: "기쁨과 행복감의 표현" },
    { pattern: /슬퍼요|우울해요/i, replacement: "마음이 많이 아프겠구나", focus: "슬픔을 부드럽게 이해하기" },
    { pattern: /피곤해요|지쳐요/i, replacement: "많이 힘들었나 보네", focus: "피로를 따뜻하게 달래기" },
    { pattern: /뭐야|뭔데|what/i, replacement: "궁금한 게 있구나", focus: "의문을 부드러운 호기심으로" },
    { pattern: /어쩌라고|그래서/i, replacement: "어떻게 하면 좋을까", focus: "무관심을 관심으로 바꾸기" },
  ];

  let translation = koreanText;
  let emotionalFocus = "다정한 말투로 변환";

  for (const pattern of emotionalPatterns) {
    if (pattern.pattern.test(koreanText)) {
      translation = koreanText.replace(pattern.pattern, pattern.replacement);
      emotionalFocus = pattern.focus;
      break;
    }
  }

  if (translation === koreanText) {
    if (/[!]{2,}|[?]{2,}/.test(koreanText)) {
      translation = "마음에 있는 말을 다정하게 전해드릴게요";
      emotionalFocus = "강한 감정을 부드럽게 달래기";
    } else if (/\.{2,}|…/.test(koreanText)) {
      translation = "깊은 생각이 담긴 말이네요";
      emotionalFocus = "여운과 생각을 소중히 여기기";
    } else {
      translation = "따뜻한 마음으로 전해드려요";
      emotionalFocus = "모든 말에 담긴 마음을 소중히 하기";
    }
  }

  return {
    translation,
    emotionalFocus
  };
}

export function getTodayDate(): string {
  const now = new Date();
  const kstOffset = 9 * 60;
  const resetHour = 5;
  
  const kstTime = new Date(now.getTime() + (kstOffset * 60 * 1000));
  
  if (kstTime.getHours() < resetHour) {
    kstTime.setDate(kstTime.getDate() - 1);
  }
  
  return kstTime.toISOString().split('T')[0];
}

export function getRandomCuteMessage(): { character: string; message: string } {
  const messages = [
    { 
      character: '🐻', 
      message: '오늘의 AI 크레딧이 모두 사용되어\n부드러운 번역 알고리즘으로 제공됩니다 😊\n\n하루 125명의 이용자분께\nAI 번역을 제공하고 있어요!\n내일 새벽 5시에 다시 만나요 ✨' 
    },
    { 
      character: '🐱', 
      message: '📢 오늘의 AI 번역 서비스가 마감되었어요!\n125명의 이용자님께 제공 완료!\n\n걱정 마세요~ 기본 번역 기능은\n계속 사용하실 수 있어요 💝\n내일 새벽 5시에 AI가 다시 시작해요!' 
    },
    { 
      character: '🐇', 
      message: '오늘 125명 정원이 꽉 찼어요!\nAI가 잠시 쉬는 동안\n저희 감성 번역기가 대신\n정성껏 번역해드릴게요 🌙\n\n새벽 5시에 다시 만나요!' 
    }
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
}

export function getRandomCuteExhaustedMessage(): string {
  const messages = [
    `🐻 오늘의 마법(✨)이 다 떨어졌어요!
AI 번역 요정이 오늘은 잠깐 쉬는 중이에요.
대신 저희 다정한 번역기가 직접
다정하게 말을 다듬어 드릴게요 ☁️
내일 아침엔 다시 AI 요정이 돌아옵니다!`,

    `🐱 📢 오늘의 감정 번역 크레딧이 모두 소진되었어요.
AI 감성 요정이 낮잠을 자는 중이에요.
그래도 걱정 마세요!
저희가 직접 말투를 다정하게 고쳐드릴게요.
내일 다시 오시면 부드럽고 따뜻한 번역을 드릴 수 있어요!`,

    `🐇 오늘의 감성 마법이 살~짝 부족해요!
대신 우리가 손으로 정성껏 다듬어볼게요 💕
내일 아침이면 AI 요정이 다시 깨어나요 ☀️`
  ];
  
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];
  return randomMessage + '\n\n⏰ 내일 오전 5시 이후 다시 이용하실 수 있어요!';
}
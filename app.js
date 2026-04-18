// ===== 한글 데이터 =====
const DATA = {
  consonants: {
    title: '자음',
    color: '#FF6B6B',
    items: ['ㄱ','ㄴ','ㄷ','ㄹ','ㅁ','ㅂ','ㅅ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ','ㄲ','ㄸ','ㅃ','ㅆ','ㅉ']
  },
  vowels: {
    title: '모음',
    color: '#4ECDC4',
    items: ['ㅏ','ㅑ','ㅓ','ㅕ','ㅗ','ㅛ','ㅜ','ㅠ','ㅡ','ㅣ','ㅐ','ㅒ','ㅔ','ㅖ','ㅘ','ㅙ','ㅚ','ㅝ','ㅞ','ㅟ','ㅢ']
  },
  words: {
    title: '단어',
    color: '#45B7D1',
    items: [
      '가', '나', '다', '라', '마', '바', '사', '아', '자',
      '차', '카', '타', '파', '하',
      '엄마', '아빠', '나무', '사과', '바다', '하늘',
      '구름', '토끼', '강아지', '고양이', '사랑',
      '가방', '우유', '포도', '딸기', '수박',
      '학교', '친구', '선생님', '공부', '놀이터',
      '꽃', '별', '달', '해', '산', '물',
      '책상', '의자', '연필', '지우개', '공책',
      '김치', '라면', '피자', '치킨', '김밥',
      '병아리', '코끼리', '거북이', '물고기', '나비',
      '자동차', '기차', '비행기', '배', '자전거'
    ]
  },
  sentences: {
    title: '문장 쓰기',
    color: '#F7DC6F',
    items: [
      '나는 사과를 먹어요',
      '엄마 아빠 사랑해요',
      '강아지가 귀여워요',
      '하늘이 파래요',
      '친구와 놀아요',
      '우유를 마셔요',
      '꽃이 예뻐요',
      '비가 와요',
      '학교에 가요',
      '책을 읽어요'
    ]
  },
  countries: {
    title: '나라 이름',
    color: '#E17055',
    items: [
      '한국', '미국', '중국', '일본', '영국',
      '프랑스', '독일', '호주', '캐나다', '브라질',
      '인도', '러시아', '스페인', '태국', '베트남',
      '터키', '이집트', '스위스', '멕시코', '이탈리아'
    ]
  }
};

const ENCOURAGEMENTS_GREAT = [
  '완벽해! ✨',
  '최고야! 🌟',
  '대단해! 🎉',
  '천재인걸! 🏆',
  '너무 잘했어! ⭐'
];

const ENCOURAGEMENTS_GOOD = [
  '잘했어! 👏',
  '잘 쓰고 있어! 💪',
  '좋아요! 😊',
  '멋져! 🌈'
];

const ENCOURAGEMENTS_TRY = [
  '다시 해보자! 💪',
  '조금만 더! 😊',
  '천천히 따라 써봐! ✏️',
  '할 수 있어! 🌟'
];

const COLORS_PALETTE = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
  '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
  '#A29BFE', '#FD79A8', '#00B894', '#E17055'
];

// ===== 상태 관리 =====
let currentCategory = null;
let currentIndex = 0;
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let currentColor = '#2D3436';
let isErasing = false;
let eraserSize = 30;

const PEN_COLORS = [
  '#2D3436', '#FF6B6B', '#FDCB6E', '#00B894',
  '#0984E3', '#6C5CE7', '#E84393', '#E17055'
];

const ERASER_SIZES = [
  { size: 15, preview: 10, label: '작게' },
  { size: 30, preview: 18, label: '중간' },
  { size: 55, preview: 28, label: '크게' }
];

// ===== DOM 요소 =====
const screens = {
  home: document.getElementById('home-screen'),
  select: document.getElementById('select-screen'),
  practice: document.getElementById('practice-screen')
};

const canvas = document.getElementById('draw-canvas');
const ctx = canvas.getContext('2d');

// 정확도 판정용 숨겨진 캔버스
const refCanvas = document.createElement('canvas');
const refCtx = refCanvas.getContext('2d');

// ===== 화면 전환 =====
function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  screens[name].classList.add('active');
}

// ===== 홈 화면 - 카테고리 선택 =====
document.querySelectorAll('.category-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const category = btn.dataset.category;
    openCategory(category);
  });
});

function openCategory(category) {
  currentCategory = category;
  const data = DATA[category];

  document.getElementById('select-title').textContent = data.title;

  const grid = document.getElementById('char-grid');
  grid.innerHTML = '';

  if (category === 'words' || category === 'countries') {
    grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(130px, 1fr))';
  } else if (category === 'sentences') {
    grid.style.gridTemplateColumns = '1fr';
  } else {
    grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(100px, 1fr))';
  }

  data.items.forEach((item, i) => {
    const btn = document.createElement('button');
    btn.className = 'char-btn' + (category === 'sentences' ? ' wide' : '');
    btn.textContent = item;
    btn.style.background = COLORS_PALETTE[i % COLORS_PALETTE.length];
    btn.addEventListener('click', () => openPractice(i));
    grid.appendChild(btn);
  });

  showScreen('select');
}

// ===== 글자 선택 화면 - 뒤로 =====
document.getElementById('back-to-home').addEventListener('click', () => {
  showScreen('home');
});

// ===== 쓰기 연습 화면 =====
function openPractice(index) {
  currentIndex = index;
  showScreen('practice');

  // 화면이 보인 후 캔버스 초기화 (레이아웃 완료 후 실행)
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      updatePractice();
    });
  });
}

function updatePractice() {
  const data = DATA[currentCategory];
  const item = data.items[currentIndex];

  // 가이드 글자
  const guideChar = document.getElementById('guide-char');
  guideChar.textContent = item;

  // 문장/단어에 따라 컨테이너 크기 조절
  const container = document.querySelector('.guide-container');
  if (currentCategory === 'sentences') {
    container.classList.add('wide');
  } else if ((currentCategory === 'words' || currentCategory === 'countries') && item.length >= 2) {
    container.classList.add('wide');
  } else {
    container.classList.remove('wide');
  }

  // 글자 수에 따라 가이드 폰트 크기 동적 조절
  requestAnimationFrame(() => {
    const containerRect = container.getBoundingClientRect();
    if (containerRect.width === 0) return;
    if (item.length === 1) {
      guideChar.style.fontSize = '';
    } else {
      const maxW = containerRect.width * 0.85;
      const maxH = containerRect.height * 0.75;
      // 한글 한 글자 폭 ≈ 1em, 공백 ≈ 0.3em
      const charCount = item.replace(/ /g, '').length + (item.split(' ').length - 1) * 0.3;
      const fitByWidth = Math.floor(maxW / charCount);
      const fitByHeight = Math.floor(maxH);
      const fontSize = Math.min(fitByWidth, fitByHeight, 280);
      guideChar.style.fontSize = fontSize + 'px';
    }
  });

  // 진행 상황
  document.getElementById('practice-progress').textContent =
    `${currentIndex + 1} / ${data.items.length}`;

  // 이전/다음 버튼 상태
  document.getElementById('prev-btn').style.visibility =
    currentIndex > 0 ? 'visible' : 'hidden';
  document.getElementById('next-btn').style.visibility =
    currentIndex < data.items.length - 1 ? 'visible' : 'hidden';

  // 점수/격려 초기화
  document.getElementById('score-display').innerHTML = '';
  document.getElementById('encouragement').textContent = '';

  // 캔버스 크기 재설정 후 초기화
  resizeCanvas();
  clearCanvas();

  // 레퍼런스 캔버스에 가이드 글자 렌더링 (정확도 판정용)
  renderReference(item);

  // 자동 발음
  speak(item);
}

// ===== 캔버스 설정 =====
function resizeCanvas() {
  const rect = canvas.parentElement.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return;

  const dpr = window.devicePixelRatio || 1;
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);

  // 선 스타일 설정
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.lineWidth = 8;
  ctx.strokeStyle = currentColor;
}

function clearCanvas() {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const dpr = window.devicePixelRatio || 1;
  ctx.scale(dpr, dpr);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.lineWidth = 8;
  ctx.strokeStyle = currentColor;
}

// ===== 레퍼런스 캔버스 (정확도 비교용) =====
function renderReference(text) {
  const rect = canvas.parentElement.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return;

  refCanvas.width = Math.round(rect.width);
  refCanvas.height = Math.round(rect.height);

  refCtx.clearRect(0, 0, refCanvas.width, refCanvas.height);
  refCtx.fillStyle = '#000000';
  refCtx.textAlign = 'center';
  refCtx.textBaseline = 'middle';

  // 글자 크기를 캔버스에 맞게 조정
  let fontSize;
  if (text.length === 1) {
    fontSize = Math.min(refCanvas.width, refCanvas.height) * 0.7;
  } else if (text.length <= 3) {
    fontSize = Math.min(refCanvas.width, refCanvas.height) * 0.45;
  } else {
    fontSize = Math.min(refCanvas.width / text.length * 1.5, refCanvas.height * 0.6);
  }

  refCtx.font = `300 ${fontSize}px -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', sans-serif`;
  refCtx.fillText(text, refCanvas.width / 2, refCanvas.height / 2);
}

// ===== 정확도 판정 (그리드 기반 형태 비교) =====
function checkAccuracy() {
  const rect = canvas.parentElement.getBoundingClientRect();
  const w = Math.round(rect.width);
  const h = Math.round(rect.height);

  if (w === 0 || h === 0) return -1;

  // 사용자가 그린 것을 비교용 크기로 축소
  const userCanvas = document.createElement('canvas');
  userCanvas.width = w;
  userCanvas.height = h;
  const userCtx = userCanvas.getContext('2d');
  userCtx.drawImage(canvas, 0, 0, w, h);

  const userData = userCtx.getImageData(0, 0, w, h).data;
  const refData = refCtx.getImageData(0, 0, w, h).data;

  // 아무것도 안 썼는지 확인
  let totalUserPixels = 0;
  for (let i = 3; i < userData.length; i += 4) {
    if (userData[i] > 30) totalUserPixels++;
  }
  if (totalUserPixels < 50) return -1;

  // 캔버스를 그리드로 나누어 형태 비교
  const GRID = 16;
  const cellW = w / GRID;
  const cellH = h / GRID;

  const refGrid = new Uint8Array(GRID * GRID);
  const userGrid = new Uint8Array(GRID * GRID);

  for (let gy = 0; gy < GRID; gy++) {
    for (let gx = 0; gx < GRID; gx++) {
      let refCount = 0;
      let userCount = 0;
      let cellPixels = 0;

      const sx = Math.floor(gx * cellW);
      const ex = Math.floor((gx + 1) * cellW);
      const sy = Math.floor(gy * cellH);
      const ey = Math.floor((gy + 1) * cellH);

      for (let y = sy; y < ey; y++) {
        for (let x = sx; x < ex; x++) {
          const idx = (y * w + x) * 4;
          cellPixels++;
          if (refData[idx + 3] > 30) refCount++;
          if (userData[idx + 3] > 30) userCount++;
        }
      }

      // 셀 내 5% 이상 채워지면 "있음"으로 판정
      const threshold = cellPixels * 0.05;
      refGrid[gy * GRID + gx] = refCount > threshold ? 1 : 0;
      userGrid[gy * GRID + gx] = userCount > threshold ? 1 : 0;
    }
  }

  // 레퍼런스를 1칸씩 확장 (손가락 두께 여유)
  const refExpanded = new Uint8Array(GRID * GRID);
  for (let gy = 0; gy < GRID; gy++) {
    for (let gx = 0; gx < GRID; gx++) {
      if (refGrid[gy * GRID + gx] === 1) {
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const ny = gy + dy;
            const nx = gx + dx;
            if (ny >= 0 && ny < GRID && nx >= 0 && nx < GRID) {
              refExpanded[ny * GRID + nx] = 1;
            }
          }
        }
      }
    }
  }

  // 그리드 비교
  let refCells = 0;     // 레퍼런스에 글자가 있는 셀 수
  let userCells = 0;    // 사용자가 쓴 셀 수
  let overlap = 0;      // 둘 다 있는 셀 (정답)
  let falsePos = 0;     // 사용자만 있는 셀 (엉뚱한 곳에 씀)

  for (let i = 0; i < GRID * GRID; i++) {
    if (refExpanded[i]) refCells++;
    if (userGrid[i]) {
      userCells++;
      if (refExpanded[i]) {
        overlap++;
      } else {
        falsePos++;
      }
    }
  }

  if (userCells === 0) return -1;

  // 정밀도: 쓴 것 중 글자 위에 쓴 비율 (엉뚱한 데 쓰면 낮아짐)
  const precision = overlap / userCells;

  // 커버리지: 글자 영역 중 사용자가 채운 비율 (덜 쓰면 낮아짐)
  const coverage = refCells > 0 ? overlap / refCells : 0;

  // 최종 점수: 정밀도를 더 중시 (엉뚱한 모양에 높은 페널티)
  // 정밀도 70% 이상 + 커버리지 25% 이상이어야 좋은 점수
  const precisionScore = Math.min(precision / 0.7, 1.0);
  const coverageScore = Math.min(coverage / 0.25, 1.0);

  const finalScore = (precisionScore * 0.6 + coverageScore * 0.4) * 100;

  // 엉뚱한 곳에 많이 쓰면 추가 감점
  const fpRatio = falsePos / userCells;
  const penalty = fpRatio > 0.3 ? (fpRatio - 0.3) * 80 : 0;

  return Math.round(Math.max(0, Math.min(finalScore - penalty, 100)));
}

function showScore(score) {
  const scoreEl = document.getElementById('score-display');
  const encourageEl = document.getElementById('encouragement');

  if (score === -1) {
    scoreEl.innerHTML = '';
    encourageEl.textContent = '먼저 글자를 써보자! ✏️';
    encourageEl.style.opacity = '1';
    return;
  }

  let stars = '';
  let messages;

  if (score >= 80) {
    stars = '⭐⭐⭐';
    messages = ENCOURAGEMENTS_GREAT;
    playSound('great');
  } else if (score >= 50) {
    stars = '⭐⭐';
    messages = ENCOURAGEMENTS_GOOD;
    playSound('good');
  } else {
    stars = '⭐';
    messages = ENCOURAGEMENTS_TRY;
    playSound('try');
  }

  const msg = messages[Math.floor(Math.random() * messages.length)];

  scoreEl.innerHTML = `<span class="score-stars">${stars}</span>`;
  encourageEl.textContent = msg;
  encourageEl.style.opacity = '1';
}

// ===== 터치 이벤트 (손가락 그리기) =====
function getPos(e) {
  const rect = canvas.getBoundingClientRect();
  if (e.touches && e.touches.length > 0) {
    return {
      x: e.touches[0].clientX - rect.left,
      y: e.touches[0].clientY - rect.top
    };
  }
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
}

function applyStrokeMode() {
  if (isErasing) {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = eraserSize;
  } else {
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = 8;
  }
}

function startDrawing(e) {
  e.preventDefault();
  isDrawing = true;
  applyStrokeMode();
  const pos = getPos(e);
  lastX = pos.x;
  lastY = pos.y;
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);
  showEraserCursorAt(pos.x, pos.y);
}

function draw(e) {
  e.preventDefault();

  const pos = getPos(e);
  showEraserCursorAt(pos.x, pos.y);

  if (!isDrawing) return;

  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();

  lastX = pos.x;
  lastY = pos.y;
}

function stopDrawing(e) {
  if (e) e.preventDefault();
  if (isDrawing) {
    isDrawing = false;
  }
  // 터치 이벤트면 떼는 순간 커서 숨김 (마우스는 mouseleave에서 처리)
  if (e && e.type && e.type.startsWith('touch')) {
    hideEraserCursor();
  }
}

// 터치 이벤트
canvas.addEventListener('touchstart', startDrawing, { passive: false });
canvas.addEventListener('touchmove', draw, { passive: false });
canvas.addEventListener('touchend', stopDrawing, { passive: false });
canvas.addEventListener('touchcancel', stopDrawing, { passive: false });

// 마우스 이벤트 (PC 테스트용)
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseleave', (e) => { stopDrawing(e); hideEraserCursor(); });

// ===== 소리 (TTS + 효과음) =====
let koreanVoice = null;

function pickKoreanVoice() {
  const voices = speechSynthesis.getVoices();
  const koVoices = voices.filter(v => v.lang.startsWith('ko'));
  if (koVoices.length === 0) return;

  // 부드러운 여성 음성 우선 선택
  const preferred = ['Sunhi', 'Yuna', 'Heami', 'Google 한국어', 'Female', 'female', '여성'];
  for (const keyword of preferred) {
    const match = koVoices.find(v => v.name.includes(keyword));
    if (match) { koreanVoice = match; return; }
  }
  // 못 찾으면 첫 번째 한국어 음성
  koreanVoice = koVoices[0];
}

// 음성 목록은 비동기로 로드됨
speechSynthesis.addEventListener('voiceschanged', pickKoreanVoice);
pickKoreanVoice();

const CHAR_NAMES = {
  'ㄱ':'기역','ㄴ':'니은','ㄷ':'디귿','ㄹ':'리을','ㅁ':'미음',
  'ㅂ':'비읍','ㅅ':'시옷','ㅇ':'이응','ㅈ':'지읒','ㅊ':'치읓',
  'ㅋ':'키읔','ㅌ':'티읕','ㅍ':'피읖','ㅎ':'히읗',
  'ㄲ':'쌍기역','ㄸ':'쌍디귿','ㅃ':'쌍비읍','ㅆ':'쌍시옷','ㅉ':'쌍지읒'
};

function speak(text) {
  speechSynthesis.cancel();
  // 자음이면 정식 이름으로 읽기
  const speakText = CHAR_NAMES[text] || text;
  const len = text.length;

  const utter = new SpeechSynthesisUtterance(len === 1 ? speakText + '.' : speakText);
  utter.lang = 'ko-KR';
  if (koreanVoice) utter.voice = koreanVoice;
  utter.rate = len === 1 ? 0.6 : 1.0;
  utter.pitch = 1.0;
  speechSynthesis.speak(utter);
}

function playSound(type) {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  gain.gain.value = 0.15;

  if (type === 'great') {
    // 빠르게 올라가는 음 (성공)
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523, audioCtx.currentTime);       // 도
    osc.frequency.setValueAtTime(659, audioCtx.currentTime + 0.1); // 미
    osc.frequency.setValueAtTime(784, audioCtx.currentTime + 0.2); // 솔
    gain.gain.setValueAtTime(0.15, audioCtx.currentTime + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.5);
  } else if (type === 'good') {
    // 짧은 성공음
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523, audioCtx.currentTime);
    osc.frequency.setValueAtTime(659, audioCtx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.15, audioCtx.currentTime + 0.25);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.4);
  } else if (type === 'try') {
    // 부드러운 격려음
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(392, audioCtx.currentTime);
    osc.frequency.setValueAtTime(349, audioCtx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.12, audioCtx.currentTime + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.35);
  }
}

// ===== 컨트롤 버튼 =====
document.getElementById('clear-btn').addEventListener('click', () => {
  clearCanvas();
  document.getElementById('score-display').innerHTML = '';
  document.getElementById('encouragement').textContent = '';
});

document.getElementById('sound-btn').addEventListener('click', () => {
  const item = DATA[currentCategory].items[currentIndex];
  speak(item);
});

document.getElementById('check-btn').addEventListener('click', () => {
  const score = checkAccuracy();
  showScore(score);
});

document.getElementById('prev-btn').addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
    updatePractice();
  }
});

document.getElementById('next-btn').addEventListener('click', () => {
  const data = DATA[currentCategory];
  if (currentIndex < data.items.length - 1) {
    currentIndex++;
    updatePractice();
  }
});

document.getElementById('back-to-select').addEventListener('click', () => {
  showScreen('select');
});

// ===== 색상 팔레트 + 지우개 생성 =====
(function initColorPalette() {
  const palette = document.getElementById('color-palette');

  function selectTool(button) {
    palette.querySelectorAll('.color-dot, .eraser-dot').forEach(d => d.classList.remove('selected'));
    button.classList.add('selected');
  }

  PEN_COLORS.forEach(color => {
    const dot = document.createElement('button');
    dot.className = 'color-dot' + (color === currentColor ? ' selected' : '');
    dot.style.background = color;
    dot.addEventListener('click', () => {
      currentColor = color;
      isErasing = false;
      ctx.strokeStyle = color;
      selectTool(dot);
      hideEraserCursor();
    });
    palette.appendChild(dot);
  });

  // 구분선
  const divider = document.createElement('span');
  divider.className = 'palette-divider';
  palette.appendChild(divider);

  // 지우개 버튼 3개 (작게/중간/크게)
  ERASER_SIZES.forEach(({ size, preview, label }) => {
    const eraser = document.createElement('button');
    eraser.className = 'eraser-dot';
    eraser.title = `지우개 (${label})`;
    const inner = document.createElement('span');
    inner.className = 'eraser-preview';
    inner.style.width = preview + 'px';
    inner.style.height = preview + 'px';
    eraser.appendChild(inner);

    eraser.addEventListener('click', () => {
      isErasing = true;
      eraserSize = size;
      selectTool(eraser);
      updateEraserCursor();
    });
    palette.appendChild(eraser);
  });
})();

// ===== 지우개 원형 커서 =====
const eraserCursor = document.createElement('div');
eraserCursor.className = 'eraser-cursor';
eraserCursor.style.display = 'none';
document.querySelector('.guide-container').appendChild(eraserCursor);

function updateEraserCursor() {
  eraserCursor.style.width = eraserSize + 'px';
  eraserCursor.style.height = eraserSize + 'px';
}

function showEraserCursorAt(x, y) {
  if (!isErasing) return;
  eraserCursor.style.display = 'block';
  eraserCursor.style.left = x + 'px';
  eraserCursor.style.top = y + 'px';
}

function hideEraserCursor() {
  eraserCursor.style.display = 'none';
}

// ===== 화면 크기 변경 대응 =====
window.addEventListener('resize', () => {
  if (screens.practice.classList.contains('active')) {
    const dpr = window.devicePixelRatio || 1;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    resizeCanvas();
    ctx.putImageData(imageData, 0, 0);
    // 레퍼런스도 다시 생성
    const item = DATA[currentCategory].items[currentIndex];
    renderReference(item);
  }
});

// ===== 스크롤 방지 =====
document.body.addEventListener('touchmove', (e) => {
  if (e.target === canvas) {
    e.preventDefault();
  }
}, { passive: false });

// ===== 서비스 워커 등록 (자동 업데이트) =====
if ('serviceWorker' in navigator) {
  // sw.js 자체는 캐시 안하고 항상 최신으로 체크
  navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' })
    .then((registration) => {
      // 새 서비스워커가 감지되면 설치 완료 후 교체
      registration.addEventListener('updatefound', () => {
        const newSW = registration.installing;
        if (!newSW) return;
        newSW.addEventListener('statechange', () => {
          if (newSW.state === 'installed' && navigator.serviceWorker.controller) {
            // 새 버전 설치됨 - 바로 활성화 요청
            newSW.postMessage('SKIP_WAITING');
          }
        });
      });

      // 앱이 포커스될 때마다 업데이트 체크 (홈화면 앱에 중요)
      const checkForUpdate = () => registration.update().catch(() => {});
      window.addEventListener('focus', checkForUpdate);
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') checkForUpdate();
      });
    })
    .catch(() => {});

  // 새 서비스워커가 페이지를 장악하면 자동 새로고침
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return;
    refreshing = true;
    window.location.reload();
  });
}

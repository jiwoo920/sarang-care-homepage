#!/usr/bin/env bash
set -euo pipefail

BRANCH="cursor/add-sarang-care-content-2d72"
REMOTE="origin"
PORT="${PORT:-8081}"
SITE_URL="http://localhost:${PORT}/"

cd "$(dirname "$0")"

echo "== 사랑요양원 홈페이지 업데이트 =="
echo "프로젝트 폴더: $(pwd)"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "오류: 이 폴더는 Git 저장소가 아닙니다."
  exit 1
fi

if [ -n "$(git status --porcelain)" ]; then
  echo "오류: 저장되지 않은 변경사항이 있습니다."
  echo "먼저 변경사항을 저장하거나 정리한 뒤 다시 실행해 주세요."
  git status --short
  exit 1
fi

echo
echo "1) 최신 코드 받는 중..."
git fetch "$REMOTE" "$BRANCH"
if git show-ref --verify --quiet "refs/heads/$BRANCH"; then
  git checkout "$BRANCH"
else
  git checkout -b "$BRANCH" "$REMOTE/$BRANCH"
fi
git pull "$REMOTE" "$BRANCH"

echo
echo "2) 기존 ${PORT}번 서버 확인 중..."
if command -v lsof >/dev/null 2>&1; then
  PIDS="$(lsof -ti tcp:"$PORT" || true)"
  if [ -n "$PIDS" ]; then
    echo "기존 ${PORT}번 서버를 종료합니다: $PIDS"
    kill $PIDS 2>/dev/null || true
    sleep 1
  fi
else
  echo "lsof 명령을 찾을 수 없어 포트 점유 확인을 건너뜁니다."
fi

echo
echo "3) 새 서버 시작 중..."
nohup python3 -m http.server "$PORT" > .site-server.log 2>&1 &
SERVER_PID=$!
echo "$SERVER_PID" > .site-server.pid

sleep 1

if ! kill -0 "$SERVER_PID" 2>/dev/null; then
  echo "오류: 서버 시작에 실패했습니다."
  echo "로그를 확인해 주세요: .site-server.log"
  exit 1
fi

echo "서버가 시작되었습니다. PID: $SERVER_PID"
echo "사이트 주소: $SITE_URL"
echo "입소 안내 주소: ${SITE_URL}admission-guide.html"

if command -v open >/dev/null 2>&1; then
  open "$SITE_URL"
fi

echo
echo "완료! 브라우저에서 새로고침해서 확인해 주세요."

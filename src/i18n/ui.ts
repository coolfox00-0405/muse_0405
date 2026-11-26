import { Language } from './types';

export interface UIMessages {
  meta: {
    title: string;
    description: string;
  };
  languageSwitcher: {
    ariaLabel: string;
    menuLabel: string;
    options: Record<Language, string>;
  };
  nav: {
    today: string;
    journal: string;
    read: string;
    about: string;
    primaryNavAria: string;
    mobileNavAria: string;
    logoHomeAria: string;
    logoAlt: string;
  };
  errors: {
    storagePersist: string;
    storageSaveGeneric: string;
    storageCleanupGeneric: string;
    storageEmptyInputOrAttempt: string;
    storageEmptyNote: string;
    storageEditNotFound: string;
    storageEmptyUpdate: string;
    storageUpdateError: string;
    storageEmptyFollowUp: string;
    storageFollowUpTargetMissing: string;
    storageFollowUpSaveError: string;
    storageDeleteError: string;
    storageRestoreError: string;
    invalidJsonFile: string;
    invalidBackupStructure: string;
    corruptedBackupEntry: string;
    missingRequiredBackupFields: string;
    fileReadError: string;
    restoreFallbackError: string;
  };
  shuffleSpread: {
    idleAria: string;
    shufflingAria: string;
    selectingPickAria: (index: number) => string;
    selectingPickedAria: (index: number, order: number) => string;
  };
  cardFlip: {
    backClickableAria: string;
    frontCardAria: (displayName: string, enName: string) => string;
    backImageAlt: string;
  };
  cardArtwork: {
    imageAlt: (displayName: string, enName: string) => string;
    fallbackAria: (displayName: string, enName: string) => string;
    imageLoadFailed: string;
  };
  today: {
    sectionShuffleAria: string;
    sectionResultAria: string;
    onboardingAsideAria: string;
    onboardingToggle: string;
    onboardingDismiss: string;
    onboardingBullets: string[];
    heroSubtitle: string;
    heroTitle: string;
    heroLead: string;
    deckGroupAria: string;
    deckFull: string;
    deckMajor: string;
    drawCountGroupAria: string;
    drawOne: string;
    drawThree: string;
    perspectiveGroupAria: string;
    perspectiveStandard: string;
    perspectiveOpen: string;
    idlePrompt: string;
    shuffleButton: string;
    idleSubHint: string;
    savedNotesBanner: (count: number) => string;
    shufflingStatus: string;
    selectingSinglePrompt: string;
    selectingThreePrompt: (pickedCount: number) => string;
    threeCardPositions: [string, string, string];
    positionFallback: (idx: number) => string;
    slotPicked: string;
    slotWaiting: string;
    reshuffleButton: string;
    guideTitle: string;
    guideSteps: { num: string; title: string; body: string }[];
    spreadSelectorAria: string;
    messageHeading: string;
    questionHeading: string;
    pastRecordNotice: (cardName: string, count: number) => string;
    pastRecordButton: string;
    synthesisAria: string;
    synthesisHeading: string;
    synthesisThreeCard: (
      c1Name: string,
      c1Kw: string,
      c2Name: string,
      c2Kw: string,
      c3Name: string,
      c3Kw: string
    ) => string;
    synthesisSingleReversed: (cardName: string, keywordsJoined: string) => string;
    synthesisSingleUpright: (cardName: string, keywordsJoined: string) => string;
    nextActionsAria: string;
    newReadingButton: string;
    goHomeButton: string;
    preserveNotesHint: string;
    attemptsAria: string;
    attemptsHeading: string;
    attemptsSelectedBadge: (count: number) => string;
    attemptsHint: string;
    attemptsSyncedNotice: (count: number) => string;
    viewInJournal: string;
    noteSectionAria: string;
    noteHeading: string;
    noteSectionHint: string;
    savedReadingNoteLabel: string;
    noteInputAria: string;
    notePlaceholderFollowUp: string;
    notePlaceholderEmpty: string;
    noteSaveButton: string;
    noteErrorEmpty: string;
    noteSavedFeedback: string;
    noteSaveErrorFallback: string;
  };
  journal: {
    sectionAria: string;
    title: string;
    totalCount: (count: number) => string;
    freeformCardName: string;
    freeformDefaultQuestion: string;
    backupToggleOpen: string;
    backupToggleClose: string;
    backupEmptyOpen: string;
    composeOpen: string;
    composeClose: string;
    emptyLead: string;
    emptyGoToday: string;
    emptyWriteFreeform: string;
    emptyExampleHeading: string;
    emptyExampleBody: string;
    composeLabel: string;
    autoDraftSaved: string;
    clearDraft: string;
    promptsHint: string;
    freeformPrompts: string[];
    followUpPrompts: string[];
    composePlaceholder: string;
    closeButton: string;
    saveButton: string;
    filterGroupAria: string;
    filters: {
      all: string;
      card: string;
      freeform: string;
      action: string;
    };
    searchPlaceholder: string;
    searchAria: string;
    clearSearchAria: string;
    noMatchesTitle: string;
    noMatchesHint: string;
    typeFreeform: string;
    typeCard: string;
    typeThreeCards: string;
    badgeAttempts: (count: number) => string;
    badgeFollowUps: (count: number) => string;
    backToList: string;
    openCardArchiveAria: (cardName: string) => string;
    openCardArchiveLink: string;
    editButton: string;
    editAria: string;
    deleteButton: string;
    deleteAria: string;
    spreadSnapshotTitle: (count: number) => string;
    spreadSlotFallback: (idx: number) => string;
    viewInArchiveShort: string;
    questionPrefix: string;
    cardInterpretationTitle: string;
    overallMessageTitle: string;
    reflectionQuestionTitle: string;
    selectedAttemptsTitle: string;
    deleteConfirmText: string;
    deleteConfirmCancel: string;
    deleteConfirmAction: string;
    deleteConfirmAria: string;
    editActionMemoLabel: string;
    editActionMemoPlaceholder: string;
    editNoteLabel: string;
    editNotePlaceholder: string;
    editCancel: string;
    editSave: string;
    myThoughtLabel: string;
    attemptsOnlyHint: string;
    followUpAria: string;
    followUpHeading: string;
    followUpSubheading: string;
    followUpToggleOpen: string;
    followUpToggleClose: string;
    followUpPromptSelectLabel: string;
    followUpPlaceholder: string;
    followUpInputAria: string;
    followUpSave: string;
    feedbackCreated: string;
    feedbackCreateError: string;
    feedbackUpdated: string;
    feedbackUpdateError: string;
    feedbackFollowUpSaved: string;
    feedbackFollowUpError: string;
    feedbackDeleteError: string;
    backupPanelAria: string;
    backupPanelTitle: string;
    backupPanelCount: (count: number, date: string) => string;
    backupPanelDescription: string;
    exportJson: string;
    exportCsv: string;
    importJson: string;
    importFileInputAria: string;
    noRecordsToExport: string;
    exportJsonSuccess: (count: number) => string;
    exportJsonError: string;
    exportCsvSuccess: (count: number) => string;
    exportCsvError: string;
    csvHeaders: string[];
    csvOrientReversed: string;
    csvOrientUpright: string;
    restoreRegionAria: string;
    restoreFileLabel: (name: string) => string;
    restoreCountLabel: (count: number, exportedAt?: string) => string;
    restoreModeLegend: string;
    restoreMergeTitle: string;
    restoreMergeDesc: string;
    restoreReplaceTitle: string;
    restoreReplaceDesc: string;
    restoreRun: string;
    restoreMergeSuccess: (added: number, total: number) => string;
    restoreReplaceSuccess: (total: number) => string;
    restoreFailedFallback: string;
    invalidBackupFallback: string;
  };
  readMyself: {
    sectionAria: string;
    subtitle: string;
    title: string;
    description: string;
    rangeGroupAria: string;
    ranges: {
      recent: string;
      custom: string;
      all: string;
    };
    startDateLabel: string;
    endDateLabel: string;
    resetRange: string;
    emptyTitle: string;
    emptyBody: string;
    goTodayButton: string;
    goJournalButton: string;
    noRangeRecordsTitle: string;
    noRangeRecordsBody: string;
    oneRecordTitle: string;
    oneRecordBody: string;
    viewOriginal: string;
    scopeSummary: (count: number) => string;
    themesTitle: string;
    keywordCountLabel: (count: number) => string;
    flowTitle: string;
    originalShort: string;
    recurringQuestionsTitle: string;
    sourceRecordLabel: (dateLabel: string) => string;
    connectionTitle: string;
    closingQuestionsTitle: string;
    localNoticeText: string;
    flagMarked: string;
    flagAction: string;
    flagMarkedNote: string;
    flagDefaultNote: string;
  };
  about: {
    sectionAria: string;
    title: string;
    tagline: string;
    introBody: string;
    encyclopediaTitle: string;
    encyclopediaDesc: string;
    encyclopediaButton: string;
    howToTitle: string;
    howToSteps: string[];
    noticeReflectionTitle: string;
    noticeReflectionBody: string;
    noticeStorageTitle: string;
    noticeStorageBody: string;
  };
  encyclopedia: {
    archiveSubtitle: string;
    title: string;
    closeAria: string;
    missingImageNotice: string;
    backToList: string;
    backToReading: string;
    categoryMinor: string;
    categoryMajor: string;
    suits: {
      wands: string;
      cups: string;
      swords: string;
      pentacles: string;
    };
    filters: {
      all: string;
      major: string;
      wands: string;
      cups: string;
      swords: string;
      pentacles: string;
    };
    symbolismAria: string;
    meaningTitle: string;
    insightTitle: string;
    questionTitle: string;
    gentleActionTitle: string;
    myNotesAria: string;
    myNotesTitle: string;
    countLabel: (count: number) => string;
    writeNoteOpen: string;
    writeNoteClose: string;
    noteErrorEmpty: string;
    noteSaved: string;
    noteSaveError: string;
    notePlaceholder: (cardName: string) => string;
    noteTextareaAria: string;
    cancel: string;
    saveToNotes: string;
    emptyCardNotes: string;
    openRecord: string;
    selectedAttemptPrefix: (text: string) => string;
    attemptsOnlyPlaceholder: string;
    filterTabsAria: string;
    searchPlaceholder: string;
    searchAria: string;
    noCardsFound: string;
    showAllCards: string;
    myRecordCount: (count: number) => string;
  };
  pwa: {
    headerInstall: string;
    appIconAlt: string;
    cardTitle: string;
    cardDesc: string;
    cardButtonIOS: string;
    cardButtonInstall: string;
    iosModalTitle: string;
    iosModalSubtitle: string;
    iosModalCloseAria: string;
    iosStep1Before: string;
    iosStep1Bold: string;
    iosStep1After: string;
    iosStep2Before: string;
    iosStep2Bold: string;
    iosStep2After: string;
    iosStep3Before: string;
    iosStep3Bold: string;
    iosStep3After: string;
    confirm: string;
  };
  reminder: {
    headerButtonAria: string;
    modalCloseAria: string;
    title: string;
    subtitle: string;
    toggleLabel: string;
    toggleDescActive: string;
    toggleDescPaused: string;
    toggleAria: string;
    statusActiveBadge: string;
    statusPausedBadge: string;
    statusSkippedBadge: string;
    timeTitle: string;
    hourLabel: string;
    minuteLabel: string;
    formatHourOption: (hour: number) => string;
    formatMinuteOption: (minute: number) => string;
    formatTimeDisplay: (hour: number, minute: number) => string;
    repeatTitle: string;
    dailyOption: string;
    weekdaysShort: Record<0 | 1 | 2 | 3 | 4 | 5 | 6, string>;
    weekdaysFull: Record<0 | 1 | 2 | 3 | 4 | 5 | 6, string>;
    minDayWarning: string;
    skipTodayTitle: string;
    skipTodayDesc: string;
    skipTodayActiveNote: (nextTimeLabel: string) => string;
    skipTodayTomorrowLabel: string;
    skipTodayWeekdayLabel: (weekdayName: string) => string;
    previewTitle: string;
    previewPhoneNow: string;
    previewCycleButton: string;
    previewTestButton: string;
    testSentFeedback: string;
    testDeniedFeedback: string;
    testUnsupportedFeedback: string;
    permissionDeniedTitle: string;
    permissionDeniedBody: string;
    permissionDefaultTitle: string;
    permissionDefaultBody: string;
    permissionAllowButton: string;
    permissionUnsupportedBody: string;
    scopeNoticeTitle: string;
    scopeNoticeBody: string;
    scheduleSummaryDaily: (timeStr: string) => string;
    scheduleSummaryWeekly: (daysStr: string, timeStr: string) => string;
  };
}

export const UI_TRANSLATIONS: Record<Language, UIMessages> = {
  ko: {
    meta: {
      title: 'LUCIDA',
      description:
        '내 안의 빛을 발견하는 시간. 타로 카드를 매개로 지금의 나를 바라보는 자기성찰 웹앱 LUCIDA',
    },
    languageSwitcher: {
      ariaLabel: '언어 선택',
      menuLabel: '표시 언어 목록',
      options: {
        ko: '한국어',
        en: 'English',
        ja: '日本語',
      },
    },
    nav: {
      today: '지금, 나에게',
      journal: '인사이트 노트',
      read: '나를 읽다',
      about: '앱 소개',
      primaryNavAria: '주요 메뉴',
      mobileNavAria: '하단 메뉴',
      logoHomeAria: 'LUCIDA 첫 화면으로 이동',
      logoAlt: 'LUCIDA 심볼과 영문 로고',
    },
    errors: {
      storagePersist:
        '기록을 저장하는 중 문제가 발생했습니다. 브라우저 저장 설정을 확인해 주세요.',
      storageSaveGeneric: '기록을 저장하는 중 문제가 발생했습니다.',
      storageCleanupGeneric: '기록을 정리하는 중 문제가 발생했습니다.',
      storageEmptyInputOrAttempt:
        '저장할 내용을 먼저 입력하거나 시도를 선택해 주세요.',
      storageEmptyNote: '저장할 내용을 먼저 입력해 주세요.',
      storageEditNotFound: '수정할 기록을 찾을 수 없습니다.',
      storageEmptyUpdate: '내용을 비워둘 수 없습니다.',
      storageUpdateError: '기록을 수정하는 중 문제가 발생했습니다.',
      storageEmptyFollowUp: '추가할 생각을 먼저 입력해 주세요.',
      storageFollowUpTargetMissing: '연결할 기록을 찾을 수 없습니다.',
      storageFollowUpSaveError: '돌아본 기록을 저장하는 중 문제가 발생했습니다.',
      storageDeleteError: '기록을 삭제하는 중 문제가 발생했습니다.',
      storageRestoreError: '백업 데이터를 복원하는 중 저장 오류가 발생했습니다.',
      invalidJsonFile:
        '올바른 JSON 형식의 파일이 아닙니다. 기존 기록은 안전하게 유지됩니다.',
      invalidBackupStructure:
        'LUCIDA 백업 파일 구조와 일치하지 않습니다. 기존 기록은 변경되지 않았습니다.',
      corruptedBackupEntry:
        '백업 파일 안에 손상된 기록 항목이 포함되어 있어 복원을 중단했습니다.',
      missingRequiredBackupFields:
        '필수 항목(id, date, cardName, userNote, createdAt)이 누락된 기록이 있어 복원을 중단했습니다.',
      fileReadError:
        '파일을 읽는 중 오류가 발생했습니다. 기존 기록은 변경되지 않았습니다.',
      restoreFallbackError: '복원에 실패했습니다.',
    },
    shuffleSpread: {
      idleAria: '타로 카드 덱. 눌러서 카드를 셔플하세요.',
      shufflingAria: '카드를 섞고 있습니다',
      selectingPickAria: (index) => `${index}번째 타로 카드 선택하기`,
      selectingPickedAria: (index, order) =>
        `${index}번째 카드 (${order}번째로 선택됨)`,
    },
    cardFlip: {
      backClickableAria: '타로 카드 뒷면. 눌러서 카드를 섞어 보세요.',
      frontCardAria: (displayName, enName) => `${displayName} (${enName}) 카드`,
      backImageAlt: 'LUCIDA 타로 카드 뒷면 일러스트',
    },
    cardArtwork: {
      imageAlt: (displayName, enName) =>
        `${displayName} (${enName}) 카드 일러스트`,
      fallbackAria: (displayName, enName) =>
        `${displayName} (${enName}) 카드 대체 화면`,
      imageLoadFailed: '이미지를 불러올 수 없습니다',
    },
    today: {
      sectionShuffleAria: '지금, 나에게 — 카드 섞기 및 선택',
      sectionResultAria: '나에게 온 메시지',
      onboardingAsideAria: 'LUCIDA 첫 방문 안내',
      onboardingToggle: '처음 오셨나요? LUCIDA 이용 안내',
      onboardingDismiss: '다시 보지 않기',
      onboardingBullets: [
        '• LUCIDA는 미래를 예언하지 않고, 카드를 통해 지금의 나를 돌아보는 자기성찰 도구입니다.',
        '• 특정 시간에 얽매이지 않고 원할 때 언제든 카드를 섞고 뽑아 질문을 만날 수 있습니다.',
        '• 기록은 선택사항이며, 작성한 내용은 현재 브라우저에만 저장되므로 필요 시 인사이트 노트에서 JSON으로 백업할 수 있습니다.',
      ],
      heroSubtitle: 'NOW, LOOK WITHIN',
      heroTitle: '지금, 나에게',
      heroLead: '내 안의 빛을 발견하는 시간.',
      deckGroupAria: '덱 구성 선택',
      deckFull: '전체 78장',
      deckMajor: '핵심 22장',
      drawCountGroupAria: '뽑기 장수 선택',
      drawOne: '한 장 성찰',
      drawThree: '세 장 흐름',
      perspectiveGroupAria: '해석 시선 설정',
      perspectiveStandard: '기본 시선',
      perspectiveOpen: '열린 시선',
      idlePrompt: '마음이 머무는 순간, 카드를 통해 나를 바라보세요.',
      shuffleButton: '카드 섞기',
      idleSubHint: '정답을 찾기보다 지금 떠오르는 생각에 귀 기울여 보세요.',
      savedNotesBanner: (count) =>
        `저장된 인사이트 노트 ${count}건 보존 중 · 기록 보기`,
      shufflingStatus: '카드를 천천히 섞고 있습니다...',
      selectingSinglePrompt: '마음이 이끄는 카드 한 장을 직접 선택해 주세요.',
      selectingThreePrompt: (pickedCount) =>
        `마음이 이끄는 카드 3장을 중복 없이 차례로 선택해 주세요 (${pickedCount}/3).`,
      threeCardPositions: ['지금의 마음', '바라볼 시선', '작은 걸음'],
      positionFallback: (idx) => `${idx + 1}번째 카드`,
      slotPicked: '선택됨',
      slotWaiting: '선택 대기',
      reshuffleButton: '다시 섞기',
      guideTitle: 'LUCIDA와 머무는 흐름',
      guideSteps: [
        {
          num: '01.',
          title: '질문 떠올리기',
          body: '지금 마음에 머무는 생각이나 감정을 가볍게 떠올립니다.',
        },
        {
          num: '02.',
          title: '카드와 질문 만나기',
          body: '정답이 아닌 새로운 시선을 건네는 메시지에 잠시 머뭅니다.',
        },
        {
          num: '03.',
          title: '원하면 한 줄 기록',
          body: '떠오른 생각만 인사이트 노트에 남기거나 기록 없이 마쳐도 좋습니다.',
        },
      ],
      spreadSelectorAria: '뽑은 세 장의 카드 흐름',
      messageHeading: '나에게 온 메시지',
      questionHeading: '나에게 던져볼 질문',
      pastRecordNotice: (cardName, count) =>
        `이전에 「${cardName}」 카드를 만났던 기록 ${count}건`,
      pastRecordButton: '이전 기록 이어서 보기',
      synthesisAria: '리딩 종합 메시지',
      synthesisHeading: '리딩 종합 메시지',
      synthesisThreeCard: (c1Name, c1Kw, c2Name, c2Kw, c3Name, c3Kw) =>
        `지금의 마음을 비추는 「${c1Name}」(${c1Kw})에서 시작해, 「${c2Name}」(${c2Kw})의 시선으로 상황을 살피고, 「${c3Name}」(${c3Kw})가 건네는 작은 걸음으로 오늘의 호흡을 이어가는 흐름입니다. 세 장 중 지금 가장 시선이 머무는 카드의 질문부터 천천히 답해 보세요.`,
      synthesisSingleReversed: (cardName, keywordsJoined) =>
        `「${cardName}」 카드는 지금의 나에게 ‘${keywordsJoined}’이라는 주제를 평소와 조금 다른 각도에서 천천히 들여다보게 합니다. 서둘러 결론을 내리기보다 지금 내 마음에 조용히 걸리는 지점을 담담히 살펴보세요.`,
      synthesisSingleUpright: (cardName, keywordsJoined) =>
        `「${cardName}」 카드는 지금의 나에게 ‘${keywordsJoined}’의 시선을 조용히 비추고 있습니다. 모든 문장을 다 기억하려 하기보다, 지금 가장 마음에 남는 질문 하나만 가볍게 간직해 보세요.`,
      nextActionsAria: '리딩 다음 행동',
      newReadingButton: '새 리딩 시작',
      goHomeButton: '처음 화면으로',
      preserveNotesHint:
        '새로운 리딩을 시작해도 저장된 인사이트 노트는 그대로 보존됩니다.',
      attemptsAria: '선택 가능한 시도',
      attemptsHeading: '선택 가능한 시도',
      attemptsSelectedBadge: (count) => `${count}개 선택 · 자동 저장됨`,
      attemptsHint: '체크한 내용은 인사이트 노트에 기록됩니다.',
      attemptsSyncedNotice: (count) =>
        `선택한 시도 ${count}개가 인사이트 노트에 자동 저장되었습니다.`,
      viewInJournal: '인사이트 노트에서 보기',
      noteSectionAria: '인사이트 노트 작성',
      noteHeading: '인사이트 노트',
      noteSectionHint:
        '리딩을 보며 떠오른 생각이나 느낀 점을 기록해 두면 인사이트 노트에 보관됩니다.',
      savedReadingNoteLabel: '이번 리딩에 저장된 기록',
      noteInputAria: '인사이트 노트 입력',
      notePlaceholderFollowUp: '이어서 남기고 싶은 생각이 있다면 추가로 적어 보세요.',
      notePlaceholderEmpty:
        '카드를 보며 떠오른 생각이나 마음에 남은 문장을 자유롭게 적어 보세요.',
      noteSaveButton: '인사이트 노트에 저장',
      noteErrorEmpty: '인사이트 노트에 남길 생각을 먼저 입력해 주세요.',
      noteSavedFeedback: '인사이트 노트에 저장되었습니다.',
      noteSaveErrorFallback: '기록을 저장하는 중 문제가 발생했습니다.',
    },
    journal: {
      sectionAria: '인사이트 노트',
      title: '인사이트 노트',
      totalCount: (count) => `총 ${count}개`,
      freeformCardName: '자유 기록',
      freeformDefaultQuestion: '마음에 남은 생각이나 나에게 남기고 싶은 문장',
      backupToggleOpen: '백업 · 복원',
      backupToggleClose: '백업 닫기',
      backupEmptyOpen: '백업 불러오기',
      composeOpen: '자유 기록',
      composeClose: '작성 닫기',
      emptyLead: '마음에 남은 생각이 있다면 이곳에 천천히 모아보세요.',
      emptyGoToday: '지금, 나에게로 이동',
      emptyWriteFreeform: '자유 기록 남기기',
      emptyExampleHeading: '기록 예시 · 한 문장만 남겨도 충분해요',
      emptyExampleBody:
        '“오늘 유난히 조급했던 이유가 결과보다 타인의 시선 때문이었다는 걸 알아차렸다. 내일은 내 속도를 먼저 챙겨보자.”',
      composeLabel: '자유 기록 작성',
      autoDraftSaved: '자동 임시 저장됨',
      clearDraft: '비우기',
      promptsHint: '기록을 돕는 질문 (선택사항 — 누르면 기록의 질문으로 연결됩니다)',
      freeformPrompts: [
        '지금 가장 마음에 걸리는 것은 무엇인가요?',
        '유독 기억에 남는 순간은 무엇인가요?',
        '내가 실제로 원했던 것은 무엇이었을까요?',
        '지금의 나에게 해주고 싶은 말은 무엇인가요?',
        '다음에 비슷한 상황이 오면 다르게 해보고 싶은 점이 있나요?',
      ],
      followUpPrompts: [
        '지금 다시 읽어보니 어떤 생각이 드나요?',
        '그때와 비교해 달라진 생각이 있나요?',
        '여전히 마음에 남아 있는 부분이 있나요?',
        '새롭게 발견한 점이 있나요?',
      ],
      composePlaceholder: '짧은 한 문장이나 단어만 남겨도 충분합니다.',
      closeButton: '닫기',
      saveButton: '저장하기',
      filterGroupAria: '기록 유형 필터',
      filters: {
        all: '전체',
        card: '카드 성찰',
        freeform: '자유 기록',
        action: '남긴 시도',
      },
      searchPlaceholder: '내용, 카드명, 날짜 검색',
      searchAria: '인사이트 노트 검색',
      clearSearchAria: '검색어 지우기',
      noMatchesTitle: '조건에 맞는 기록이 없습니다',
      noMatchesHint: '검색어를 바꾸거나 필터를 ‘전체’로 돌려 보세요.',
      typeFreeform: '자유 기록',
      typeCard: '카드 성찰',
      typeThreeCards: '카드 성찰 (3장)',
      badgeAttempts: (count) => `선택한 시도 ${count}개`,
      badgeFollowUps: (count) => `돌아본 기록 ${count}건`,
      backToList: '목록으로',
      openCardArchiveAria: (cardName) => `${cardName} 카드 도감에서 자세히 보기`,
      openCardArchiveLink: '카드 도감에서 자세히 보기',
      editButton: '수정',
      editAria: '기록 수정',
      deleteButton: '삭제',
      deleteAria: '기록 삭제',
      spreadSnapshotTitle: (count) => `이 리딩에서 뽑은 카드 배열 (${count}장)`,
      spreadSlotFallback: (idx) => `${idx + 1}번째`,
      viewInArchiveShort: '도감 보기',
      questionPrefix: '질문',
      cardInterpretationTitle: '카드 해석',
      overallMessageTitle: '종합 메시지',
      reflectionQuestionTitle: '성찰 질문',
      selectedAttemptsTitle: '마음에 남은 시도',
      deleteConfirmText: '이 기록을 삭제할까요? 삭제한 내용은 되돌릴 수 없습니다.',
      deleteConfirmCancel: '취소',
      deleteConfirmAction: '삭제하기',
      deleteConfirmAria: '기록 삭제 확인',
      editActionMemoLabel: '시도에 남긴 짧은 메모 (선택사항)',
      editActionMemoPlaceholder: '짧은 생각이나 단어만 남겨도 괜찮습니다.',
      editNoteLabel: '나의 생각',
      editNotePlaceholder: '지금 떠오르는 생각을 자유롭게 수정해 보세요.',
      editCancel: '취소',
      editSave: '수정 저장',
      myThoughtLabel: '나의 생각',
      attemptsOnlyHint:
        '별도의 긴 메모 없이 선택한 시도만 가볍게 남겨둔 기록입니다. 원할 때 ‘수정’을 눌러 생각을 덧붙일 수 있습니다.',
      followUpAria: '시간이 지난 뒤 다시 돌아보기',
      followUpHeading: '시간이 지난 뒤 다시 돌아보기',
      followUpSubheading:
        '그때와 지금의 생각을 가볍게 비교하거나 새롭게 떠오른 점을 덧붙여 보세요.',
      followUpToggleOpen: '돌아본 생각 남기기',
      followUpToggleClose: '작성 닫기',
      followUpPromptSelectLabel: '질문 선택 (선택사항)',
      followUpPlaceholder:
        '지금 다시 돌아보며 떠오른 생각을 편하게 적어보세요. 짧은 단어 하나만 남겨도 괜찮습니다.',
      followUpInputAria: '시간이 지난 뒤 다시 돌아본 생각 입력',
      followUpSave: '이어서 남기기',
      feedbackCreated: '새 기록이 저장되었습니다.',
      feedbackCreateError: '기록을 저장하지 못했습니다.',
      feedbackUpdated: '기록이 수정되었습니다.',
      feedbackUpdateError: '수정에 실패했습니다.',
      feedbackFollowUpSaved: '다시 돌아본 생각이 기록에 이어졌습니다.',
      feedbackFollowUpError: '생각을 저장하지 못했습니다.',
      feedbackDeleteError: '삭제에 실패했습니다.',
      backupPanelAria: '기록 백업 및 복원',
      backupPanelTitle: '기록 백업 및 복원',
      backupPanelCount: (count, date) => `현재 ${count}개 · 기준일 ${date}`,
      backupPanelDescription:
        '현재 모든 기록은 사용 중인 브라우저(localStorage)에만 보관되며 클라우드로 자동 동기화되지 않습니다. 기기 변경이나 브라우저 데이터 삭제에 대비해 JSON 파일로 백업해 둘 수 있습니다.',
      exportJson: 'JSON 백업',
      exportCsv: 'CSV 내보내기',
      importJson: 'JSON 복원하기',
      importFileInputAria: '백업 JSON 파일 선택',
      noRecordsToExport: '내보낼 기록이 아직 없습니다.',
      exportJsonSuccess: (count) =>
        `총 ${count}개의 기록을 JSON 파일로 내보냈습니다.`,
      exportJsonError: '백업 파일을 생성하는 중 문제가 발생했습니다.',
      exportCsvSuccess: (count) =>
        `총 ${count}개의 기록을 CSV 파일로 내보냈습니다.`,
      exportCsvError: 'CSV 파일을 생성하는 중 문제가 발생했습니다.',
      csvHeaders: [
        '날짜',
        '기록 유형',
        '카드명',
        '영문명',
        '방향',
        '성찰 질문',
        '선택한 시도',
        '시도 메모',
        '나의 생각',
        '다시 돌아본 기록',
      ],
      csvOrientReversed: '열린 시선',
      csvOrientUpright: '기본 시선',
      restoreRegionAria: '복원 방식 선택 및 확인',
      restoreFileLabel: (name) => `백업 파일 확인: ${name}`,
      restoreCountLabel: (count, exportedAt) =>
        `포함된 기록: ${count}개${exportedAt ? ` · 백업 일시: ${exportedAt.slice(0, 10)}` : ''}`,
      restoreModeLegend: '복원 방식을 선택해 주세요',
      restoreMergeTitle: '기존 기록과 합치기',
      restoreMergeDesc: '(고유 ID가 같은 기록은 중복 저장하지 않습니다)',
      restoreReplaceTitle: '기존 기록 대체하기',
      restoreReplaceDesc: '(현재 브라우저의 기록을 백업 파일 내용으로 바꿉니다)',
      restoreRun: '복원 실행',
      restoreMergeSuccess: (added, total) =>
        `새 기록 ${added}개를 추가했습니다 (중복 ID 제외, 총 ${total}개).`,
      restoreReplaceSuccess: (total) =>
        `기존 기록을 백업 파일의 ${total}개 기록으로 복원했습니다.`,
      restoreFailedFallback: '복원에 실패했습니다.',
      invalidBackupFallback:
        '올바르지 않은 백업 파일입니다. 기존 기록은 안전하게 유지됩니다.',
    },
    readMyself: {
      sectionAria: '나를 읽다',
      subtitle: 'Read Myself',
      title: '나를 읽다',
      description:
        '인사이트 노트에 쌓인 기록을 원하는 범위로 모아, 생각과 관심사의 흐름을 차분히 살펴봅니다.',
      rangeGroupAria: '분석 범위 선택',
      ranges: {
        recent: '최근 기록',
        custom: '기간 직접 선택',
        all: '전체 기록',
      },
      startDateLabel: '시작일',
      endDateLabel: '종료일',
      resetRange: '기간 초기화',
      emptyTitle: '아직 살펴볼 기록이 없습니다',
      emptyBody:
        '인사이트 노트에 기록이 쌓이면 이곳에서 자주 등장하는 주제와 생각의 흐름을 천천히 돌아볼 수 있습니다.',
      goTodayButton: '지금, 나에게로 이동',
      goJournalButton: '인사이트 노트 보기',
      noRangeRecordsTitle: '선택한 기간에 해당하는 기록이 없습니다',
      noRangeRecordsBody:
        '다른 기간을 선택하거나 ‘전체 기록’으로 범위를 넓혀 살펴보세요.',
      oneRecordTitle: '기록이 조금 더 쌓이면 흐름을 읽어볼 수 있어요',
      oneRecordBody:
        '현재 선택한 범위에는 1개의 기록이 있습니다. 억지로 해석을 만들기보다 2개 이상의 기록이 모였을 때 반복되는 주제와 생각의 변화를 함께 살펴보는 편이 더 정확합니다.',
      viewOriginal: '원본 보기',
      scopeSummary: (count) =>
        `분석 대상: ${count}개의 기록 (로컬 규칙 기반 요약)`,
      themesTitle: '자주 등장한 주제와 단어',
      keywordCountLabel: (count) => `${count}개 기록에서 등장`,
      flowTitle: '이전과 최근 기록의 흐름',
      originalShort: '원본',
      recurringQuestionsTitle: '반복해서 마음에 남긴 질문',
      sourceRecordLabel: (dateLabel) => `근거 기록: ${dateLabel}`,
      connectionTitle: '기록에서 발견되는 연결점',
      closingQuestionsTitle: '다음에 스스로 살펴볼 질문',
      localNoticeText:
        '이 화면은 외부 AI 서버로 기록을 전송하지 않고, 현재 브라우저에 저장된 실제 기록만을 바탕으로 정리한 규칙 기반 참고 자료입니다.',
      flagMarked: '나에게는 맞지 않음으로 표시됨',
      flagAction: '이 요약이 나에게는 맞지 않아요',
      flagMarkedNote:
        '표시해 두었습니다. 규칙 기반 요약은 단어와 빈도의 단순한 참고일 뿐이며, 기록에 담긴 나만의 맥락과 느낌이 언제나 가장 우선합니다.',
      flagDefaultNote:
        '성격을 규정하거나 심리 상태를 진단하지 않으며, 스스로를 돌아보는 참고 관점으로만 활용해 주세요.',
    },
    about: {
      sectionAria: '앱 소개',
      title: 'LUCIDA에 대하여',
      tagline: '내 안의 빛을 발견하는 시간.',
      introBody:
        'LUCIDA는 미래를 예측하거나 운세를 단정하는 앱이 아니라, 타로 카드를 매개로 지금의 나를 돌아보는 자기성찰 도구입니다. 마음이 복잡할 때나 생각을 환기하고 싶을 때, 특정 시간대에 얽매이지 않고 언제든 카드를 섞고 뽑아 볼 수 있습니다.',
      encyclopediaTitle: '78장 타로 카드 도감',
      encyclopediaDesc:
        '78장 카드 각각의 고유한 일러스트와 상징, 내가 남긴 카드별 기록을 한눈에 살펴볼 수 있습니다.',
      encyclopediaButton: '78장 도감 열기',
      howToTitle: '함께하는 방법',
      howToSteps: [
        '잠시 숨을 고르고, 지금 마음속에 머무는 생각이나 질문을 떠올려 봅니다.',
        '카드를 섞고 한 장을 선택해 ‘나에게 온 메시지’와 질문을 천천히 읽어 봅니다.',
        '떠오른 생각이 있다면 인사이트 노트에 남겨 두고, 기록하지 않고 그대로 머물러도 괜찮습니다.',
      ],
      noticeReflectionTitle: '성찰 참고 안내',
      noticeReflectionBody:
        '타로 해석은 참고와 자기성찰을 위한 것이며, 의료·법률·재정 등 전문적인 판단을 대신하지 않습니다.',
      noticeStorageTitle: '기록 저장 안내',
      noticeStorageBody:
        '작성하신 인사이트 노트는 외부 서버로 전송되지 않고 사용 중인 브라우저(localStorage)에만 보관됩니다. 브라우저 데이터를 삭제하거나 기기를 변경하면 기록이 사라질 수 있습니다.',
    },
    encyclopedia: {
      archiveSubtitle: 'LUCIDA ARCANA ARCHIVE',
      title: '78장 타로 카드 도감',
      closeAria: '도감 닫기',
      missingImageNotice:
        '일부 카드 이미지를 불러오지 못해 기본 카드 화면으로 표시되고 있습니다.',
      backToList: '78장 목록으로',
      backToReading: '카드 뽑기로 돌아가기',
      categoryMinor: '마이너 카드',
      categoryMajor: '핵심 카드 22장',
      suits: {
        wands: '완드 (Wands)',
        cups: '컵 (Cups)',
        swords: '소드 (Swords)',
        pentacles: '펜타클 (Pentacles)',
      },
      filters: {
        all: '전체',
        major: '핵심 22장',
        wands: '완드',
        cups: '컵',
        swords: '소드',
        pentacles: '펜타클',
      },
      symbolismAria: '카드의 상징과 질문',
      meaningTitle: '상징과 의미',
      insightTitle: '성찰의 시선',
      questionTitle: '나에게 던져볼 질문',
      gentleActionTitle: '작은 시도 제안',
      myNotesAria: '이 카드에 남긴 나의 기록',
      myNotesTitle: '이 카드에 남긴 나의 기록',
      countLabel: (count) => `${count}건`,
      writeNoteOpen: '인사이트 노트에 기록',
      writeNoteClose: '작성 닫기',
      noteErrorEmpty: '남길 생각을 짧게라도 입력해 주세요.',
      noteSaved: '인사이트 노트에 기록되었습니다.',
      noteSaveError: '기록을 저장하지 못했습니다.',
      notePlaceholder: (cardName) =>
        `「${cardName}」 카드를 바라보며 떠오른 생각을 가볍게 적어 보세요.`,
      noteTextareaAria: '카드 성찰 메모 작성',
      cancel: '취소',
      saveToNotes: '노트에 저장',
      emptyCardNotes:
        '아직 이 카드를 만나 인사이트 노트에 남긴 개인 기록이 없습니다.',
      openRecord: '기록 열기',
      selectedAttemptPrefix: (text) => `선택한 시도: ${text}`,
      attemptsOnlyPlaceholder: '(선택한 시도만 기록됨)',
      filterTabsAria: '카드 구분 필터',
      searchPlaceholder: '카드 이름, 영문명, 키워드 검색',
      searchAria: '78장 타로 카드 검색',
      noCardsFound: '검색 조건에 맞는 카드가 없습니다.',
      showAllCards: '전체 78장 다시 보기',
      myRecordCount: (count) => `내 기록 ${count}건`,
    },
    pwa: {
      headerInstall: '앱 설치',
      appIconAlt: 'LUCIDA 앱 아이콘',
      cardTitle: '홈 화면에 LUCIDA 추가하기',
      cardDesc:
        '앱처럼 홈 화면에 설치해 언제든 가볍게 열어 성찰을 이어갈 수 있습니다.',
      cardButtonIOS: '홈 화면 추가 안내',
      cardButtonInstall: '앱 설치하기',
      iosModalTitle: '홈 화면에 LUCIDA 추가',
      iosModalSubtitle: 'iOS Safari 안내',
      iosModalCloseAria: '안내 닫기',
      iosStep1Before: '1. Safari 하단 또는 상단의 ',
      iosStep1Bold: '공유(Share)',
      iosStep1After: ' 버튼을 누릅니다.',
      iosStep2Before: '2. 메뉴에서 ',
      iosStep2Bold: '홈 화면에 추가',
      iosStep2After: '를 선택합니다.',
      iosStep3Before: '3. 오른쪽 상단의 ',
      iosStep3Bold: '추가',
      iosStep3After: '를 누르면 LUCIDA 아이콘이 생성됩니다.',
      confirm: '확인',
    },
    reminder: {
      headerButtonAria: '나를 만나는 시간 알림 설정 열기',
      modalCloseAria: '알림 설정 닫기',
      title: '나를 만나는 시간',
      subtitle: '잠시 멈추어 내 마음을 바라보는 시간을 정해보세요.',
      toggleLabel: '성찰 알림 켜기',
      toggleDescActive: '정해둔 시간과 요일에 맞춰 다정한 성찰 문구를 준비해 둡니다.',
      toggleDescPaused: '꺼 두어도 정해둔 시간과 요일 설정은 그대로 유지됩니다.',
      toggleAria: '나를 만나는 시간 성찰 알림 켜기 또는 끄기',
      statusActiveBadge: '켜짐',
      statusPausedBadge: '일시 멈춤',
      statusSkippedBadge: '오늘 건너뜀',
      timeTitle: '알림 시간',
      hourLabel: '시',
      minuteLabel: '분',
      formatHourOption: (hour) => {
        const period = hour < 12 ? '오전' : '오후';
        const h12 = hour % 12 === 0 ? 12 : hour % 12;
        return `${period} ${h12}시 (${String(hour).padStart(2, '0')})`;
      },
      formatMinuteOption: (minute) => `${String(minute).padStart(2, '0')}분`,
      formatTimeDisplay: (hour, minute) => {
        const period = hour < 12 ? '오전' : '오후';
        const h12 = hour % 12 === 0 ? 12 : hour % 12;
        return `${period} ${h12}:${String(minute).padStart(2, '0')}`;
      },
      repeatTitle: '반복 주기',
      dailyOption: '매일',
      weekdaysShort: {
        1: '월',
        2: '화',
        3: '수',
        4: '목',
        5: '금',
        6: '토',
        0: '일',
      },
      weekdaysFull: {
        1: '월요일',
        2: '화요일',
        3: '수요일',
        4: '목요일',
        5: '금요일',
        6: '토요일',
        0: '일요일',
      },
      minDayWarning: '반복 알림을 유지하려면 최소 하루 이상의 요일을 선택해 주세요.',
      skipTodayTitle: '오늘 알림 건너뛰기',
      skipTodayDesc: '오늘은 잠시 쉬고, 다음 예정된 날부터 다시 이어집니다.',
      skipTodayActiveNote: (nextTimeLabel) =>
        `오늘 알림은 건너뛰도록 설정했어요. ${nextTimeLabel}에 다시 안내할게요.`,
      skipTodayTomorrowLabel: '내일',
      skipTodayWeekdayLabel: (weekdayName) => `다음 ${weekdayName}`,
      previewTitle: '휴대폰 알림 미리보기',
      previewPhoneNow: '지금',
      previewCycleButton: '다른 문구 보기',
      previewTestButton: '테스트 알림 보내기',
      testSentFeedback: '테스트 알림을 보냈습니다. 알림을 누르면 ‘지금, 나에게’로 이동합니다.',
      testDeniedFeedback: '브라우저 알림 권한이 차단되어 있어 실제 알림을 보낼 수 없습니다.',
      testUnsupportedFeedback: '현재 브라우저 환경에서는 시스템 알림 API를 지원하지 않습니다.',
      permissionDeniedTitle: '브라우저 알림 권한이 차단되어 있어요',
      permissionDeniedBody:
        '시간과 요일 설정은 그대로 저장되어 있습니다. 실제 알림을 받으려면 브라우저 주소창 왼쪽의 사이트 설정 또는 기기 알림 설정에서 LUCIDA 알림을 허용해 주세요.',
      permissionDefaultTitle: '알림 권한이 아직 허용되지 않았어요',
      permissionDefaultBody:
        '설정은 안전하게 저장되었지만, 브라우저 알림을 받으려면 권한 허용이 필요합니다.',
      permissionAllowButton: '알림 권한 허용하기',
      permissionUnsupportedBody:
        '이 브라우저에서는 시스템 알림 기능을 지원하지 않지만, 설정한 시간과 문구는 저장됩니다.',
      scopeNoticeTitle: '현재 알림 동작 범위 안내',
      scopeNoticeBody:
        '지금은 설정 저장과 앱이 열려 있는 브라우저 상태에서의 성찰 알림을 지원합니다. 앱이 완전히 닫혀 있거나 휴대폰 화면이 잠긴 상태의 예약 푸시 알림은 향후 푸시 서버 연동이 추가될 때 제공될 예정입니다.',
      scheduleSummaryDaily: (timeStr) => `매일 ${timeStr}`,
      scheduleSummaryWeekly: (daysStr, timeStr) => `매주 ${daysStr} · ${timeStr}`,
    },
  },

  en: {
    meta: {
      title: 'LUCIDA',
      description:
        'A quiet moment to discover the light within. LUCIDA is a self-reflection companion using tarot cards to look inward.',
    },
    languageSwitcher: {
      ariaLabel: 'Select language',
      menuLabel: 'Language options',
      options: {
        ko: '한국어',
        en: 'English',
        ja: '日本語',
      },
    },
    nav: {
      today: 'Look Within',
      journal: 'Insight Notes',
      read: 'Read Myself',
      about: 'About',
      primaryNavAria: 'Main navigation',
      mobileNavAria: 'Bottom navigation',
      logoHomeAria: 'Go to LUCIDA home screen',
      logoAlt: 'LUCIDA emblem and wordmark logo',
    },
    errors: {
      storagePersist:
        'Something went wrong while saving your note. Please check your browser storage settings.',
      storageSaveGeneric: 'Unable to save your note right now.',
      storageCleanupGeneric: 'Unable to update your note right now.',
      storageEmptyInputOrAttempt:
        'Please write a thought or select an attempt before saving.',
      storageEmptyNote: 'Please enter a thought before saving.',
      storageEditNotFound: 'We could not find that note to update.',
      storageEmptyUpdate: 'A note cannot be saved completely empty.',
      storageUpdateError: 'Unable to update your note right now.',
      storageEmptyFollowUp: 'Please enter a follow-up reflection first.',
      storageFollowUpTargetMissing: 'Could not find the original note to link to.',
      storageFollowUpSaveError: 'Unable to save your follow-up note right now.',
      storageDeleteError: 'Unable to delete that note right now.',
      storageRestoreError:
        'A storage error occurred while restoring your backup data.',
      invalidJsonFile:
        'This file is not valid JSON. Your existing notes remain safely untouched.',
      invalidBackupStructure:
        'This file does not match the LUCIDA backup format. Your existing notes have not changed.',
      corruptedBackupEntry:
        'The backup file contains an unreadable entry, so the restore was stopped safely.',
      missingRequiredBackupFields:
        'Some records are missing required fields (id, date, cardName, userNote, createdAt), so the restore was paused.',
      fileReadError:
        'Could not read the selected file. Your existing notes remain unchanged.',
      restoreFallbackError: 'Could not restore the backup file.',
    },
    shuffleSpread: {
      idleAria: 'Tarot deck. Select to shuffle the cards.',
      shufflingAria: 'Shuffling the cards',
      selectingPickAria: (index) => `Choose tarot card ${index}`,
      selectingPickedAria: (index, order) =>
        `Card ${index} (selected #${order})`,
    },
    cardFlip: {
      backClickableAria: 'Tarot card back. Select to shuffle the deck.',
      frontCardAria: (displayName) => `${displayName} card`,
      backImageAlt: 'LUCIDA tarot card back illustration',
    },
    cardArtwork: {
      imageAlt: (displayName) => `${displayName} card illustration`,
      fallbackAria: (displayName) => `${displayName} card placeholder`,
      imageLoadFailed: 'Unable to load artwork',
    },
    today: {
      sectionShuffleAria: 'Look Within — Shuffle and draw cards',
      sectionResultAria: 'Message for You',
      onboardingAsideAria: 'First-visit guide to LUCIDA',
      onboardingToggle: 'New here? How LUCIDA works',
      onboardingDismiss: "Don't show again",
      onboardingBullets: [
        '• LUCIDA does not predict the future—it offers a quiet mirror for self-reflection through tarot imagery.',
        '• Draw whenever your mind seeks a pause, with no fixed schedule or rigid rules.',
        '• Writing is always optional. Everything stays locally in your browser, and you can export a JSON backup anytime in Insight Notes.',
      ],
      heroSubtitle: 'NOW, LOOK WITHIN',
      heroTitle: 'Look Within',
      heroLead: 'A moment to discover the light within.',
      deckGroupAria: 'Choose deck scope',
      deckFull: 'Full 78',
      deckMajor: 'Core 22',
      drawCountGroupAria: 'Choose card count',
      drawOne: '1-Card Pause',
      drawThree: '3-Card Flow',
      perspectiveGroupAria: 'Choose reading lens',
      perspectiveStandard: 'Steady Lens',
      perspectiveOpen: 'Open Lens',
      idlePrompt: 'When your mind pauses, let a card gently reflect what is within.',
      shuffleButton: 'Shuffle Cards',
      idleSubHint: 'Rather than searching for right answers, listen to what surfaces first.',
      savedNotesBanner: (count) =>
        `${count} ${count === 1 ? 'Insight Note' : 'Insight Notes'} preserved · View notes`,
      shufflingStatus: 'Gently shuffling the deck...',
      selectingSinglePrompt: 'Choose the card that quietly draws your attention.',
      selectingThreePrompt: (pickedCount) =>
        `Choose three cards one by one (${pickedCount}/3 selected).`,
      threeCardPositions: ['Present Heart', 'A Fresh Lens', 'A Gentle Step'],
      positionFallback: (idx) => `Card ${idx + 1}`,
      slotPicked: 'Selected',
      slotWaiting: 'Waiting',
      reshuffleButton: 'Shuffle Again',
      guideTitle: 'How to linger with LUCIDA',
      guideSteps: [
        {
          num: '01.',
          title: 'Hold a quiet question',
          body: 'Bring to mind a feeling, thought, or moment that has stayed with you today.',
        },
        {
          num: '02.',
          title: 'Meet the card & question',
          body: 'Rest for a moment with a perspective and question—not an answer, just a mirror.',
        },
        {
          num: '03.',
          title: 'Write only if you wish',
          body: 'Keep a brief line in Insight Notes, or simply close the reading in stillness.',
        },
      ],
      spreadSelectorAria: 'Three-card reading flow',
      messageHeading: 'Message for You',
      questionHeading: 'A Question to Sit With',
      pastRecordNotice: (cardName, count) =>
        `${count} past ${count === 1 ? 'note' : 'notes'} from meeting ${cardName}`,
      pastRecordButton: 'Revisit past note',
      synthesisAria: 'Overall Reflection',
      synthesisHeading: 'Overall Reflection',
      synthesisThreeCard: (c1Name, c1Kw, c2Name, c2Kw, c3Name, c3Kw) =>
        `This flow moves from ${c1Name} (${c1Kw}), reflecting where your heart stands now, through the perspective of ${c2Name} (${c2Kw}), toward a gentle step offered by ${c3Name} (${c3Kw}). Begin with whichever card's question lingers with you most.`,
      synthesisSingleReversed: (cardName, keywordsJoined) =>
        `${cardName} invites you to look at "${keywordsJoined}" from a quieter, less hurried angle than usual. Instead of rushing to conclude, notice softly where your thoughts hesitate or catch.`,
      synthesisSingleUpright: (cardName, keywordsJoined) =>
        `${cardName} gently shines a light on "${keywordsJoined}" for you today. There is no need to hold onto every word—simply carry the one question that speaks closest to you.`,
      nextActionsAria: 'Next steps for your reading',
      newReadingButton: 'New Reading',
      goHomeButton: 'Home',
      preserveNotesHint:
        'Starting a new reading keeps all of your saved Insight Notes safe.',
      attemptsAria: 'Gentle Ways to Reflect',
      attemptsHeading: 'Gentle Ways to Reflect',
      attemptsSelectedBadge: (count) => `${count} selected · Auto-saved`,
      attemptsHint: 'Checked reflections are automatically saved to your Insight Notes.',
      attemptsSyncedNotice: (count) =>
        `${count} ${count === 1 ? 'reflection has' : 'reflections have'} been auto-saved to Insight Notes.`,
      viewInJournal: 'View in Insight Notes',
      noteSectionAria: 'Write an Insight Note',
      noteHeading: 'Insight Note',
      noteSectionHint:
        'Anything you notice or wish to remember can be kept gently in your Insight Notes.',
      savedReadingNoteLabel: 'Saved note from this reading',
      noteInputAria: 'Write your insight note',
      notePlaceholderFollowUp: 'Add another thought whenever something new surfaces.',
      notePlaceholderEmpty:
        'Write freely about what came to mind or a line you want to remember.',
      noteSaveButton: 'Save to Insight Notes',
      noteErrorEmpty: 'Please write a thought before saving to your Insight Notes.',
      noteSavedFeedback: 'Saved to your Insight Notes.',
      noteSaveErrorFallback: 'Something went wrong while saving your note.',
    },
    journal: {
      sectionAria: 'Insight Notes',
      title: 'Insight Notes',
      totalCount: (count) => `${count} ${count === 1 ? 'note' : 'notes'}`,
      freeformCardName: 'Freeform Note',
      freeformDefaultQuestion: 'A lingering thought or a gentle reminder for yourself',
      backupToggleOpen: 'Backup & Restore',
      backupToggleClose: 'Close Backup',
      backupEmptyOpen: 'Import Backup',
      composeOpen: 'New Note',
      composeClose: 'Close Editor',
      emptyLead:
        'Whenever a thought lingers, gather it here quietly at your own pace.',
      emptyGoToday: 'Go to Look Within',
      emptyWriteFreeform: 'Write a Freeform Note',
      emptyExampleHeading: 'Sample Note · One honest sentence is plenty',
      emptyExampleBody:
        '“I realized my rush today came less from the work itself and more from worrying how others might see it. Tomorrow, I want to protect my own pace first.”',
      composeLabel: 'Write a Freeform Note',
      autoDraftSaved: 'Draft auto-saved',
      clearDraft: 'Clear',
      promptsHint:
        'Optional prompts (select one to attach it as your guiding question)',
      freeformPrompts: [
        'What has been quietly weighing on your mind lately?',
        'Which small moment from today stays with you?',
        'What were you truly hoping for underneath that feeling?',
        'What kind words would you like to offer yourself right now?',
        'If a similar moment returns, how might you meet it differently?',
      ],
      followUpPrompts: [
        'Reading this again now, what comes to mind?',
        'Has anything shifted since you first wrote this?',
        'Is there a part of this feeling that still lingers?',
        'Did you notice something new looking back?',
      ],
      composePlaceholder: 'Even a single sentence or a few quiet words is enough.',
      closeButton: 'Close',
      saveButton: 'Save Note',
      filterGroupAria: 'Filter notes by type',
      filters: {
        all: 'All',
        card: 'Card Notes',
        freeform: 'Freeform',
        action: 'With Attempts',
      },
      searchPlaceholder: 'Search notes, cards, or dates',
      searchAria: 'Search Insight Notes',
      clearSearchAria: 'Clear search',
      noMatchesTitle: 'No matching notes found',
      noMatchesHint: 'Try adjusting your search words or switching the filter to All.',
      typeFreeform: 'Freeform Note',
      typeCard: 'Card Reflection',
      typeThreeCards: 'Card Reflection (3 Cards)',
      badgeAttempts: (count) =>
        `${count} ${count === 1 ? 'reflection' : 'reflections'}`,
      badgeFollowUps: (count) =>
        `${count} ${count === 1 ? 'follow-up' : 'follow-ups'}`,
      backToList: 'Back to list',
      openCardArchiveAria: (cardName) => `View ${cardName} in the 78-card archive`,
      openCardArchiveLink: 'View card in archive',
      editButton: 'Edit',
      editAria: 'Edit note',
      deleteButton: 'Delete',
      deleteAria: 'Delete note',
      spreadSnapshotTitle: (count) => `Cards Drawn in This Reading (${count})`,
      spreadSlotFallback: (idx) => `Card ${idx + 1}`,
      viewInArchiveShort: 'Open archive',
      questionPrefix: 'Question',
      cardInterpretationTitle: 'Card Reflection',
      overallMessageTitle: 'Overall Reflection',
      reflectionQuestionTitle: 'Question to Sit With',
      selectedAttemptsTitle: 'Chosen Reflections',
      deleteConfirmText:
        'Delete this note? Once removed, it cannot be undone.',
      deleteConfirmCancel: 'Cancel',
      deleteConfirmAction: 'Delete',
      deleteConfirmAria: 'Confirm note deletion',
      editActionMemoLabel: 'Short attempt memo (optional)',
      editActionMemoPlaceholder: 'A brief note or reminder is plenty.',
      editNoteLabel: 'My Thoughts',
      editNotePlaceholder: 'Feel free to revise or expand your note.',
      editCancel: 'Cancel',
      editSave: 'Save Changes',
      myThoughtLabel: 'My Thoughts',
      attemptsOnlyHint:
        'Saved with your selected reflections only. Tap Edit anytime if you would like to add written thoughts.',
      followUpAria: 'Revisit later',
      followUpHeading: 'Looking Back Later',
      followUpSubheading:
        'Compare how you felt then and now, or add a new realization.',
      followUpToggleOpen: 'Add Follow-up',
      followUpToggleClose: 'Close',
      followUpPromptSelectLabel: 'Choose a prompt (optional)',
      followUpPlaceholder:
        'Write whatever feels true looking back now. Even a few words are enough.',
      followUpInputAria: 'Write a follow-up reflection',
      followUpSave: 'Save Follow-up',
      feedbackCreated: 'Your note has been saved.',
      feedbackCreateError: 'Could not save your note.',
      feedbackUpdated: 'Your note has been updated.',
      feedbackUpdateError: 'Could not update your note.',
      feedbackFollowUpSaved: 'Your follow-up reflection has been added.',
      feedbackFollowUpError: 'Could not save your follow-up note.',
      feedbackDeleteError: 'Could not delete your note.',
      backupPanelAria: 'Backup and restore notes',
      backupPanelTitle: 'Backup & Restore',
      backupPanelCount: (count, date) => `${count} notes · As of ${date}`,
      backupPanelDescription:
        'All notes stay strictly in this browser (localStorage) and are never synced to a cloud server. Export a JSON file anytime to back up your notes before switching devices or clearing browser data.',
      exportJson: 'Export JSON',
      exportCsv: 'Export CSV',
      importJson: 'Restore JSON',
      importFileInputAria: 'Choose backup JSON file',
      noRecordsToExport: 'There are no notes to export yet.',
      exportJsonSuccess: (count) =>
        `Exported ${count} ${count === 1 ? 'note' : 'notes'} as a JSON backup.`,
      exportJsonError: 'Unable to create the JSON backup file.',
      exportCsvSuccess: (count) =>
        `Exported ${count} ${count === 1 ? 'note' : 'notes'} as a CSV file.`,
      exportCsvError: 'Unable to create the CSV file.',
      csvHeaders: [
        'Date',
        'Type',
        'Card Name',
        'English Name',
        'Lens',
        'Reflection Question',
        'Selected Attempts',
        'Attempt Memo',
        'My Thoughts',
        'Follow-up Notes',
      ],
      csvOrientReversed: 'Open Lens',
      csvOrientUpright: 'Steady Lens',
      restoreRegionAria: 'Choose restore option and confirm',
      restoreFileLabel: (name) => `Backup file: ${name}`,
      restoreCountLabel: (count, exportedAt) =>
        `Included notes: ${count}${exportedAt ? ` · Exported: ${exportedAt.slice(0, 10)}` : ''}`,
      restoreModeLegend: 'Choose how to restore',
      restoreMergeTitle: 'Merge with existing notes',
      restoreMergeDesc: '(skips duplicate IDs already present in this browser)',
      restoreReplaceTitle: 'Replace existing notes',
      restoreReplaceDesc: '(replaces notes in this browser with the backup file)',
      restoreRun: 'Restore Notes',
      restoreMergeSuccess: (added, total) =>
        `Added ${added} new ${added === 1 ? 'note' : 'notes'} (total: ${total}).`,
      restoreReplaceSuccess: (total) =>
        `Restored ${total} ${total === 1 ? 'note' : 'notes'} from your backup.`,
      restoreFailedFallback: 'Could not restore the backup.',
      invalidBackupFallback:
        'This does not appear to be a valid backup file. Your existing notes remain safe.',
    },
    readMyself: {
      sectionAria: 'Read Myself',
      subtitle: 'Read Myself',
      title: 'Read Myself',
      description:
        'Gather your saved Insight Notes across a chosen span to observe recurring themes and how your thoughts evolve.',
      rangeGroupAria: 'Choose reflection range',
      ranges: {
        recent: 'Recent Notes',
        custom: 'Custom Dates',
        all: 'All Notes',
      },
      startDateLabel: 'From',
      endDateLabel: 'To',
      resetRange: 'Reset dates',
      emptyTitle: 'No notes to reflect on yet',
      emptyBody:
        'As you collect entries in Insight Notes, this space gently highlights recurring words and shifts in your thoughts.',
      goTodayButton: 'Go to Look Within',
      goJournalButton: 'Open Insight Notes',
      noRangeRecordsTitle: 'No notes found in this date range',
      noRangeRecordsBody:
        'Try choosing different dates or switching to All Notes.',
      oneRecordTitle: 'A clearer thread appears after one more note',
      oneRecordBody:
        'There is 1 note in this range. Rather than forcing a pattern from a single entry, revisiting once 2 or more notes accumulate gives a truer picture.',
      viewOriginal: 'View note',
      scopeSummary: (count) =>
        `Reviewing ${count} ${count === 1 ? 'note' : 'notes'} (local rule-based summary)`,
      themesTitle: 'Recurring Themes & Words',
      keywordCountLabel: (count) => `in ${count} notes`,
      flowTitle: 'Flow Across Time',
      originalShort: 'Original',
      recurringQuestionsTitle: 'Questions You Returned To',
      sourceRecordLabel: (dateLabel) => `From note: ${dateLabel}`,
      connectionTitle: 'Connections Across Your Notes',
      closingQuestionsTitle: 'Questions to Carry Forward',
      localNoticeText:
        'Nothing leaves your device. This view summarizes your locally saved notes using simple on-device text rules—never an external AI server.',
      flagMarked: 'Marked as not resonant',
      flagAction: "This summary doesn't fit me",
      flagMarkedNote:
        'Noted. Simple word-count summaries are only a light reference—your own felt meaning always comes first.',
      flagDefaultNote:
        'This does not label personality or diagnose emotions; treat it simply as a gentle mirror.',
    },
    about: {
      sectionAria: 'About LUCIDA',
      title: 'About LUCIDA',
      tagline: 'A quiet moment to discover the light within.',
      introBody:
        'LUCIDA is not a fortune-telling app or an oracle that decides your future. It is a calm self-reflection space that uses tarot symbolism as a mirror for how you feel today. Whenever you want to pause or clear your mind, you can shuffle and draw at your own pace.',
      encyclopediaTitle: '78-Card Tarot Archive',
      encyclopediaDesc:
        'Explore the artwork and symbolism of all 78 cards alongside the personal notes you have connected to each card.',
      encyclopediaButton: 'Open 78-Card Archive',
      howToTitle: 'How to Spend Time Here',
      howToSteps: [
        'Take a slow breath and notice a question or feeling present with you today.',
        'Shuffle the deck, draw a card, and read its reflection and open question without rushing.',
        'Keep a line in Insight Notes whenever you feel moved—or simply close the reading in quiet.',
      ],
      noticeReflectionTitle: 'A Gentle Note on Reflection',
      noticeReflectionBody:
        'Card reflections are meant purely for personal contemplation and do not replace professional medical, legal, or financial guidance.',
      noticeStorageTitle: 'Privacy & Local Storage',
      noticeStorageBody:
        'Your Insight Notes are never sent to any external server; they stay solely in this browser (localStorage). Clearing browser data or switching devices may erase local notes unless backed up.',
    },
    encyclopedia: {
      archiveSubtitle: 'LUCIDA ARCANA ARCHIVE',
      title: '78-Card Tarot Archive',
      closeAria: 'Close archive',
      missingImageNotice:
        'Some card artwork could not load, so placeholder frames are shown instead.',
      backToList: 'All 78 Cards',
      backToReading: 'Back to Reading',
      categoryMinor: 'Minor Suit',
      categoryMajor: 'Core 22 Cards',
      suits: {
        wands: 'Wands',
        cups: 'Cups',
        swords: 'Swords',
        pentacles: 'Pentacles',
      },
      filters: {
        all: 'All',
        major: 'Core 22',
        wands: 'Wands',
        cups: 'Cups',
        swords: 'Swords',
        pentacles: 'Pentacles',
      },
      symbolismAria: 'Card symbolism and questions',
      meaningTitle: 'Symbolism & Meaning',
      insightTitle: 'Reflective Perspective',
      questionTitle: 'A Question to Sit With',
      gentleActionTitle: 'A Gentle Attempt',
      myNotesAria: 'My Notes for This Card',
      myNotesTitle: 'My Notes for This Card',
      countLabel: (count) => `${count}`,
      writeNoteOpen: 'Add to Insight Notes',
      writeNoteClose: 'Close',
      noteErrorEmpty: 'Please write a short thought before saving.',
      noteSaved: 'Saved to your Insight Notes.',
      noteSaveError: 'Could not save your note.',
      notePlaceholder: (cardName) =>
        `Write whatever comes to mind while looking at ${cardName}.`,
      noteTextareaAria: 'Write a card reflection note',
      cancel: 'Cancel',
      saveToNotes: 'Save Note',
      emptyCardNotes:
        'You have not saved any personal notes linked to this card yet.',
      openRecord: 'Open note',
      selectedAttemptPrefix: (text) => `Chosen reflection: ${text}`,
      attemptsOnlyPlaceholder: '(Saved with selected reflection only)',
      filterTabsAria: 'Filter cards by group',
      searchPlaceholder: 'Search card name or keywords',
      searchAria: 'Search all 78 tarot cards',
      noCardsFound: 'No cards match your search.',
      showAllCards: 'Show all 78 cards',
      myRecordCount: (count) => `${count} ${count === 1 ? 'note' : 'notes'}`,
    },
    pwa: {
      headerInstall: 'Install App',
      appIconAlt: 'LUCIDA app icon',
      cardTitle: 'Add LUCIDA to Home Screen',
      cardDesc:
        'Install LUCIDA like an app for quick, distraction-free moments of reflection anytime.',
      cardButtonIOS: 'How to Add on iOS',
      cardButtonInstall: 'Install App',
      iosModalTitle: 'Add LUCIDA to Home Screen',
      iosModalSubtitle: 'iOS Safari Guide',
      iosModalCloseAria: 'Close guide',
      iosStep1Before: '1. Tap the ',
      iosStep1Bold: 'Share',
      iosStep1After: ' button in Safari.',
      iosStep2Before: '2. Choose ',
      iosStep2Bold: 'Add to Home Screen',
      iosStep2After: ' from the menu.',
      iosStep3Before: '3. Tap ',
      iosStep3Bold: 'Add',
      iosStep3After: ' in the top-right corner to place LUCIDA on your screen.',
      confirm: 'Done',
    },
    reminder: {
      headerButtonAria: 'Open reflection reminder settings',
      modalCloseAria: 'Close reminder settings',
      title: 'A Time to Meet Myself',
      subtitle: 'Choose a quiet moment to pause and look inward.',
      toggleLabel: 'Enable reflection reminder',
      toggleDescActive: 'A gentle reflection prompt will wait for you at your chosen time.',
      toggleDescPaused: 'Turning reminders off keeps your time and weekday preferences saved.',
      toggleAria: 'Toggle reflection reminder',
      statusActiveBadge: 'Active',
      statusPausedBadge: 'Paused',
      statusSkippedBadge: 'Skipped today',
      timeTitle: 'Reminder time',
      hourLabel: 'Hour',
      minuteLabel: 'Minute',
      formatHourOption: (hour) => {
        const period = hour < 12 ? 'AM' : 'PM';
        const h12 = hour % 12 === 0 ? 12 : hour % 12;
        return `${h12} ${period} (${String(hour).padStart(2, '0')})`;
      },
      formatMinuteOption: (minute) => `${String(minute).padStart(2, '0')} min`,
      formatTimeDisplay: (hour, minute) => {
        const period = hour < 12 ? 'AM' : 'PM';
        const h12 = hour % 12 === 0 ? 12 : hour % 12;
        return `${h12}:${String(minute).padStart(2, '0')} ${period}`;
      },
      repeatTitle: 'Repeat schedule',
      dailyOption: 'Every day',
      weekdaysShort: {
        1: 'Mon',
        2: 'Tue',
        3: 'Wed',
        4: 'Thu',
        5: 'Fri',
        6: 'Sat',
        0: 'Sun',
      },
      weekdaysFull: {
        1: 'Monday',
        2: 'Tuesday',
        3: 'Wednesday',
        4: 'Thursday',
        5: 'Friday',
        6: 'Saturday',
        0: 'Sunday',
      },
      minDayWarning: 'Please keep at least one weekday selected.',
      skipTodayTitle: 'Skip today’s reminder',
      skipTodayDesc: 'Rest today and automatically resume on your next scheduled day.',
      skipTodayActiveNote: (nextTimeLabel) =>
        `Today’s reminder is skipped. Your schedule will resume ${nextTimeLabel}.`,
      skipTodayTomorrowLabel: 'tomorrow',
      skipTodayWeekdayLabel: (weekdayName) => `next ${weekdayName}`,
      previewTitle: 'Mobile notification preview',
      previewPhoneNow: 'now',
      previewCycleButton: 'Preview another prompt',
      previewTestButton: 'Send test notification',
      testSentFeedback: 'Test notification sent. Clicking it brings you to Look Within.',
      testDeniedFeedback: 'Browser notifications are currently blocked in your browser settings.',
      testUnsupportedFeedback: 'System notifications are not supported in this browser.',
      permissionDeniedTitle: 'Notifications are blocked in your browser',
      permissionDeniedBody:
        'Your schedule is safely saved. To receive browser alerts, allow notifications for LUCIDA in your browser site settings or device settings.',
      permissionDefaultTitle: 'Notification permission not granted yet',
      permissionDefaultBody:
        'Your settings are saved, and browser permission is needed to show notifications.',
      permissionAllowButton: 'Allow notifications',
      permissionUnsupportedBody:
        'System notifications are unavailable in this browser, though your preferences are saved locally.',
      scopeNoticeTitle: 'How reminders currently work',
      scopeNoticeBody:
        'Your schedule is saved locally and triggers notifications while LUCIDA is open in your browser. Background push notifications when the app is completely closed or the screen is locked require a future push server integration.',
      scheduleSummaryDaily: (timeStr) => `Every day at ${timeStr}`,
      scheduleSummaryWeekly: (daysStr, timeStr) => `Every ${daysStr} · ${timeStr}`,
    },
  },

  ja: {
    meta: {
      title: 'LUCIDA',
      description:
        '内なる光に出会う静かな時間。タロットカードを通して今の自分を見つめ直す内省アプリ LUCIDA',
    },
    languageSwitcher: {
      ariaLabel: '言語を選択',
      menuLabel: '表示言語の一覧',
      options: {
        ko: '한국어',
        en: 'English',
        ja: '日本語',
      },
    },
    nav: {
      today: '今の私へ',
      journal: 'インサイトノート',
      read: '私を読む',
      about: 'アプリについて',
      primaryNavAria: 'メインメニュー',
      mobileNavAria: '下部メニュー',
      logoHomeAria: 'LUCIDAのホーム画面へ移動',
      logoAlt: 'LUCIDAシンボルとロゴ',
    },
    errors: {
      storagePersist:
        '記録の保存中に問題が発生しました。ブラウザの保存設定をご確認ください。',
      storageSaveGeneric: '記録の保存中に問題が発生しました。',
      storageCleanupGeneric: '記録の整理中に問題が発生しました。',
      storageEmptyInputOrAttempt:
        '残したい言葉を入力するか、ひとつの試みを選んでください。',
      storageEmptyNote: '残したい言葉を先に入力してください。',
      storageEditNotFound: '編集する記録が見つかりませんでした。',
      storageEmptyUpdate: '内容を空のまま保存することはできません。',
      storageUpdateError: '記録の更新中に問題が発生しました。',
      storageEmptyFollowUp: '振り返りの言葉を先に入力してください。',
      storageFollowUpTargetMissing: '紐づける記録が見つかりませんでした。',
      storageFollowUpSaveError: '振り返りの保存中に問題が発生しました。',
      storageDeleteError: '記録の削除中に問題が発生しました。',
      storageRestoreError: 'バックアップの復元中に保存エラーが発生しました。',
      invalidJsonFile:
        '正しいJSON形式のファイルではありません。これまでの記録はそのまま保たれています。',
      invalidBackupStructure:
        'LUCIDAのバックアップ形式と一致しません。これまでの記録は変更されていません。',
      corruptedBackupEntry:
        '破損した記録項目が含まれていたため、復元を安全に中断しました。',
      missingRequiredBackupFields:
        '必須項目（id, date, cardName, userNote, createdAt）が不足している記録があるため、復元を中断しました。',
      fileReadError:
        'ファイルの読み込み中にエラーが発生しました。これまでの記録は変更されていません。',
      restoreFallbackError: '復元に失敗しました。',
    },
    shuffleSpread: {
      idleAria: 'タロットカードの山。タップしてシャッフルします。',
      shufflingAria: 'カードをシャッフルしています',
      selectingPickAria: (index) => `${index}番目のタロットカードを選ぶ`,
      selectingPickedAria: (index, order) =>
        `${index}番目のカード（${order}枚目に選択）`,
    },
    cardFlip: {
      backClickableAria: 'タロットカードの裏面。タップしてシャッフルします。',
      frontCardAria: (displayName) => `${displayName}のカード`,
      backImageAlt: 'LUCIDAタロットカード裏面のイラスト',
    },
    cardArtwork: {
      imageAlt: (displayName) => `${displayName}のカードイラスト`,
      fallbackAria: (displayName) => `${displayName}の代替表示`,
      imageLoadFailed: '画像を読み込めませんでした',
    },
    today: {
      sectionShuffleAria: '今の私へ — シャッフルとカード選択',
      sectionResultAria: '今の私へのメッセージ',
      onboardingAsideAria: 'LUCIDAはじめてのご案内',
      onboardingToggle: 'はじめての方へ・LUCIDAの使い方',
      onboardingDismiss: '今後表示しない',
      onboardingBullets: [
        '• LUCIDAは未来を当てたり運勢を決めつけたりせず、カードを通して今の自分を見つめ直す内省のツールです。',
        '• 決まった時間に縛られず、気持ちを落ち着けたいときにいつでもカードを引いて問いかけに出会えます。',
        '• 記録は任意で、書いた内容は現在のブラウザにのみ保存されます。必要なときはインサイトノートからJSONでバックアップできます。',
      ],
      heroSubtitle: 'NOW, LOOK WITHIN',
      heroTitle: '今の私へ',
      heroLead: '内なる光と出会う時間。',
      deckGroupAria: 'デッキ構成の選択',
      deckFull: '全78枚',
      deckMajor: '核となる22枚',
      drawCountGroupAria: '引く枚数の選択',
      drawOne: '1枚で省みる',
      drawThree: '3枚の流れ',
      perspectiveGroupAria: '視点の設定',
      perspectiveStandard: '基本の視点',
      perspectiveOpen: 'ひらかれた視点',
      idlePrompt: '心の向くままに、カードを通して今の自分を見つめてみてください。',
      shuffleButton: 'カードを混ぜる',
      idleSubHint: '正解を探すよりも、今ふと浮かぶ想いに目を向けてみましょう。',
      savedNotesBanner: (count) =>
        `保存されたインサイトノート ${count}件を保持中 · 記録を見る`,
      shufflingStatus: 'カードをゆっくり混ぜています...',
      selectingSinglePrompt: '直感で心惹かれるカードを1枚選んでください。',
      selectingThreePrompt: (pickedCount) =>
        `心惹かれるカードを重複なく3枚順番に選んでください（${pickedCount}/3）。`,
      threeCardPositions: ['今の心', '見つめる視点', '小さな一歩'],
      positionFallback: (idx) => `${idx + 1}枚目`,
      slotPicked: '選択済み',
      slotWaiting: '選択待ち',
      reshuffleButton: '混ぜ直す',
      guideTitle: 'LUCIDAと過ごす流れ',
      guideSteps: [
        {
          num: '01.',
          title: '問いを思い浮かべる',
          body: '今、心の片隅にある気持ちや考えをそっと思い浮かべます。',
        },
        {
          num: '02.',
          title: 'カードと問いに出会う',
          body: '答えではなく、新しい視点をそっと差し出す言葉と静かに向き合います。',
        },
        {
          num: '03.',
          title: '気が向けば一行だけ残す',
          body: '浮かんだことをノートに残しても、何も書かずに閉じてもかまいません。',
        },
      ],
      spreadSelectorAria: '選んだ3枚のカードの流れ',
      messageHeading: '私へ届いたメッセージ',
      questionHeading: '自分への静かな問い',
      pastRecordNotice: (cardName, count) =>
        `以前に「${cardName}」のカードと出会った記録 ${count}件`,
      pastRecordButton: '過去の記録を見る',
      synthesisAria: 'リーディング全体のまとめ',
      synthesisHeading: 'リーディングのまとめ',
      synthesisThreeCard: (c1Name, c1Kw, c2Name, c2Kw, c3Name, c3Kw) =>
        `今の心を映す「${c1Name}」（${c1Kw}）から始まり、「${c2Name}」（${c2Kw}）の視点で状況を見つめ、「${c3Name}」（${c3Kw}）がそっと示す小さな一歩へと続く流れです。3枚の中で今いちばん心に留まるカードの問いから、ゆっくり向き合ってみてください。`,
      synthesisSingleReversed: (cardName, keywordsJoined) =>
        `「${cardName}」のカードは、今のあなたに「${keywordsJoined}」というテーマを普段とは少し違う角度から静かに見つめるよう語りかけています。急いで結論を出すよりも、心にふと引っかかる感覚をそのまま確かめてみてください。`,
      synthesisSingleUpright: (cardName, keywordsJoined) =>
        `「${cardName}」のカードは、今のあなたに「${keywordsJoined}」という穏やかな光を当てています。すべての言葉を覚えようとせず、いちばん心に残った問いをひとつだけそっと持ち帰ってみてください。`,
      nextActionsAria: '次の操作',
      newReadingButton: '新しいリーディング',
      goHomeButton: '最初の画面へ',
      preserveNotesHint:
        '新しいリーディングを始めても、保存されたインサイトノートはそのまま残ります。',
      attemptsAria: '試してみたい小さな一歩',
      attemptsHeading: '選んでみること',
      attemptsSelectedBadge: (count) => `${count}件選択 · 自動保存済み`,
      attemptsHint: 'チェックした内容はインサイトノートに自動で記録されます。',
      attemptsSyncedNotice: (count) =>
        `選んだ試み ${count}件がインサイトノートに自動保存されました。`,
      viewInJournal: 'インサイトノートで見る',
      noteSectionAria: 'インサイトノートを書く',
      noteHeading: 'インサイトノート',
      noteSectionHint:
        'カードを見て浮かんだ思いや感じたことを書くと、インサイトノートに大切に保管されます。',
      savedReadingNoteLabel: 'このリーディングに保存された記録',
      noteInputAria: 'インサイトノートの入力欄',
      notePlaceholderFollowUp: '続けて書き留めたい思いがあれば書き足してみてください。',
      notePlaceholderEmpty:
        'カードを見てふと浮かんだことや、心に残った言葉を自由に残してみてください。',
      noteSaveButton: 'インサイトノートに保存',
      noteErrorEmpty: '保存する前に、浮かんだ想いを入力してください。',
      noteSavedFeedback: 'インサイトノートに保存されました。',
      noteSaveErrorFallback: '記録の保存中に問題が発生しました。',
    },
    journal: {
      sectionAria: 'インサイトノート',
      title: 'インサイトノート',
      totalCount: (count) => `全${count}件`,
      freeformCardName: '自由記録',
      freeformDefaultQuestion: '心に残った思いや、自分に伝えておきたい一言',
      backupToggleOpen: 'バックアップ・復元',
      backupToggleClose: '閉じる',
      backupEmptyOpen: 'バックアップ読込',
      composeOpen: '自由記録',
      composeClose: '作成を閉じる',
      emptyLead:
        '心に残った言葉や気づきがあれば、ここへゆっくり集めてみてください。',
      emptyGoToday: '今の私へ戻る',
      emptyWriteFreeform: '自由記録を書く',
      emptyExampleHeading: '記録の例 · 一言だけでも十分です',
      emptyExampleBody:
        '「今日やけに焦っていたのは、結果そのものよりも周囲の目が気になっていたからだと気づいた。明日はまず自分のペースを守ってみよう。」',
      composeLabel: '自由記録を書く',
      autoDraftSaved: '下書き自動保存済み',
      clearDraft: 'クリア',
      promptsHint: '書くときのヒント（任意 — 選ぶと記録の問いとして添えられます）',
      freeformPrompts: [
        '今、いちばん心に引っかかっていることは何ですか？',
        '今日の中で特に記憶に残っている瞬間はありますか？',
        'その気持ちの奥で、本当は何を望んでいたのでしょうか？',
        '今の自分にそっとかけてあげたい言葉は何ですか？',
        '次に同じような場面が訪れたら、どう向き合ってみたいですか？',
      ],
      followUpPrompts: [
        '今あらためて読み返してみて、どんな気持ちが浮かびますか？',
        '書いた当時と比べて、考えや感じ方に変化はありましたか？',
        '今も変わらず心に残っている部分はどこですか？',
        '振り返ってみて新しく気づいたことはありますか？',
      ],
      composePlaceholder: '短い一文や単語だけでも十分です。',
      closeButton: '閉じる',
      saveButton: '保存する',
      filterGroupAria: '記録の種別フィルター',
      filters: {
        all: 'すべて',
        card: 'カードの記録',
        freeform: '自由記録',
        action: '選んだ試み',
      },
      searchPlaceholder: '内容・カード名・日付で検索',
      searchAria: 'インサイトノートを検索',
      clearSearchAria: '検索語を消す',
      noMatchesTitle: '条件に合う記録がありません',
      noMatchesHint: '検索語を変えるか、フィルターを「すべて」に戻してみてください。',
      typeFreeform: '自由記録',
      typeCard: 'カード省察',
      typeThreeCards: 'カード省察（3枚）',
      badgeAttempts: (count) => `選んだ試み ${count}件`,
      badgeFollowUps: (count) => `振り返り ${count}件`,
      backToList: '一覧に戻る',
      openCardArchiveAria: (cardName) => `${cardName}をカード図鑑で詳しく見る`,
      openCardArchiveLink: 'カード図鑑で詳しく見る',
      editButton: '編集',
      editAria: '記録を編集',
      deleteButton: '削除',
      deleteAria: '記録を削除',
      spreadSnapshotTitle: (count) => `このリーディングで引いたカード（${count}枚）`,
      spreadSlotFallback: (idx) => `${idx + 1}枚目`,
      viewInArchiveShort: '図鑑を見る',
      questionPrefix: '問い',
      cardInterpretationTitle: 'カードのメッセージ',
      overallMessageTitle: '全体のまとめ',
      reflectionQuestionTitle: '自分への問い',
      selectedAttemptsTitle: '心に残った試み',
      deleteConfirmText:
        'この記録を削除しますか？削除した内容は元に戻せません。',
      deleteConfirmCancel: 'キャンセル',
      deleteConfirmAction: '削除する',
      deleteConfirmAria: '記録の削除確認',
      editActionMemoLabel: '試みに添えた短いメモ（任意）',
      editActionMemoPlaceholder: '短いメモや単語だけでも大丈夫です。',
      editNoteLabel: '自分の想い',
      editNotePlaceholder: '今浮かぶ想いに合わせて自由に書き直せます。',
      editCancel: 'キャンセル',
      editSave: '変更を保存',
      myThoughtLabel: '自分の想い',
      attemptsOnlyHint:
        '選んだ試みだけを軽やかに残した記録です。「編集」からいつでも言葉を書き足せます。',
      followUpAria: '時間をおいて振り返る',
      followUpHeading: '時間をおいて振り返る',
      followUpSubheading:
        '当時の思いと今の思いをそっと比べたり、新しい気づきを書き添えたりできます。',
      followUpToggleOpen: '振り返りを残す',
      followUpToggleClose: '閉じる',
      followUpPromptSelectLabel: '問いを選ぶ（任意）',
      followUpPlaceholder:
        '今振り返って浮かんだことを気楽に書いてみてください。短い一言でもかまいません。',
      followUpInputAria: '時間をおいて振り返った思いの入力',
      followUpSave: '書き添える',
      feedbackCreated: '新しい記録を保存しました。',
      feedbackCreateError: '記録を保存できませんでした。',
      feedbackUpdated: '記録を更新しました。',
      feedbackUpdateError: '更新できませんでした。',
      feedbackFollowUpSaved: '振り返りの言葉を記録に書き添えました。',
      feedbackFollowUpError: '言葉を保存できませんでした。',
      feedbackDeleteError: '削除できませんでした。',
      backupPanelAria: '記録のバックアップと復元',
      backupPanelTitle: 'バックアップと復元',
      backupPanelCount: (count, date) => `現在 ${count}件 · 基準日 ${date}`,
      backupPanelDescription:
        'すべての記録はお使いのブラウザ（localStorage）にのみ保存され、クラウドへは送信されません。端末の変更やデータ消去に備え、JSONファイルとして書き出して保管できます。',
      exportJson: 'JSONで書き出す',
      exportCsv: 'CSVで書き出す',
      importJson: 'JSONから復元',
      importFileInputAria: 'バックアップJSONファイルを選択',
      noRecordsToExport: '書き出せる記録がまだありません。',
      exportJsonSuccess: (count) =>
        `${count}件の記録をJSONファイルとして書き出しました。`,
      exportJsonError: 'バックアップファイルの作成中に問題が発生しました。',
      exportCsvSuccess: (count) =>
        `${count}件の記録をCSVファイルとして書き出しました。`,
      exportCsvError: 'CSVファイルの作成中に問題が発生しました。',
      csvHeaders: [
        '日付',
        '記録の種類',
        'カード名',
        '英語名',
        '視点',
        '自分への問い',
        '選んだ試み',
        '試みのメモ',
        '自分の想い',
        '振り返り',
      ],
      csvOrientReversed: 'ひらかれた視点',
      csvOrientUpright: '基本の視点',
      restoreRegionAria: '復元方法の選択と確認',
      restoreFileLabel: (name) => `バックアップファイル: ${name}`,
      restoreCountLabel: (count, exportedAt) =>
        `含まれる記録: ${count}件${exportedAt ? ` · 書出日: ${exportedAt.slice(0, 10)}` : ''}`,
      restoreModeLegend: '復元方法を選んでください',
      restoreMergeTitle: '現在の記録と合わせる',
      restoreMergeDesc: '（同じIDの記録は重複して保存されません）',
      restoreReplaceTitle: '現在の記録を置き換える',
      restoreReplaceDesc: '（ブラウザ内の記録をバックアップの内容で上書きします）',
      restoreRun: '復元を実行',
      restoreMergeSuccess: (added, total) =>
        `新しい記録を${added}件追加しました（合計 ${total}件）。`,
      restoreReplaceSuccess: (total) =>
        `バックアップから${total}件の記録を復元しました。`,
      restoreFailedFallback: '復元に失敗しました。',
      invalidBackupFallback:
        '正しいバックアップファイルではありません。これまでの記録は安全に保たれています。',
    },
    readMyself: {
      sectionAria: '私を読む',
      subtitle: 'Read Myself',
      title: '私を読む',
      description:
        'インサイトノートに重なった記録を好きな範囲でまとめ、思考や関心の移り変わりを静かにたどります。',
      rangeGroupAria: '振り返る期間の選択',
      ranges: {
        recent: '最近の記録',
        custom: '期間を指定',
        all: 'すべての記録',
      },
      startDateLabel: '開始日',
      endDateLabel: '終了日',
      resetRange: '期間をリセット',
      emptyTitle: 'まだ振り返る記録がありません',
      emptyBody:
        'インサイトノートに記録が集まると、ここでよく現れる言葉や思いの流れをゆっくり見返せるようになります。',
      goTodayButton: '今の私へ移動',
      goJournalButton: 'インサイトノートを見る',
      noRangeRecordsTitle: '指定した期間に記録がありません',
      noRangeRecordsBody:
        '別の日付を選ぶか、「すべての記録」へ広げてご覧ください。',
      oneRecordTitle: '記録がもう少し集まると流れが見えてきます',
      oneRecordBody:
        '選択した範囲には記録が1件あります。1件だけで無理に傾向を読み取るよりも、2件以上集まったときに重なるテーマや気持ちの変化を見つめるほうが自然です。',
      viewOriginal: '元の記録へ',
      scopeSummary: (count) =>
        `対象: ${count}件の記録（端末内ルールによる要約）`,
      themesTitle: '繰り返し現れたテーマと言葉',
      keywordCountLabel: (count) => `${count}件の記録に登場`,
      flowTitle: '時間の流れと変化',
      originalShort: '原文',
      recurringQuestionsTitle: '繰り返し心に留めた問い',
      sourceRecordLabel: (dateLabel) => `元の記録: ${dateLabel}`,
      connectionTitle: '記録どうしのつながり',
      closingQuestionsTitle: '次に自分へ向けてみたい問い',
      localNoticeText:
        '記録が外部のAIサーバーへ送信されることはありません。この画面はブラウザ内に保存された記録のみをもとに端末内のルールでまとめた参考メモです。',
      flagMarked: '自分には合わないとして記録済み',
      flagAction: 'このまとめはしっくりこない',
      flagMarkedNote:
        '印をつけておきました。言葉の出現頻度をもとにした整理はささやかな参考であり、記録に込められたあなた自身の感覚が何より大切です。',
      flagDefaultNote:
        '性格を決めつけたり状態を診断したりするものではありません。自分を振り返るひとつの視点としてお役立てください。',
    },
    about: {
      sectionAria: 'アプリについて',
      title: 'LUCIDAについて',
      tagline: '内なる光に出会う、静かな時間。',
      introBody:
        'LUCIDAは未来を予言したり運勢を断定したりするアプリではなく、タロットカードを鏡として今の自分を見つめ直すための内省ツールです。心を整理したいときや少し立ち止まりたいとき、時間に縛られずいつでもカードを引いてみることができます。',
      encyclopediaTitle: '78枚のタロットカード図鑑',
      encyclopediaDesc:
        '全78枚それぞれの繊細なイラストや象徴、そしてあなたがカードごとに残した記録を一覧で振り返ることができます。',
      encyclopediaButton: '78枚図鑑を開く',
      howToTitle: 'LUCIDAとの向き合い方',
      howToSteps: [
        'ひと呼吸おいて、今心の中にある気持ちや問いかけをそっと浮かべてみます。',
        'カードを混ぜて一枚を選び、「私へ届いたメッセージ」と問いを急がず読んでみます。',
        '浮かんだことがあればインサイトノートに書き留め、書かずにそのまま静かに閉じても大丈夫です。',
      ],
      noticeReflectionTitle: '内省に関するご案内',
      noticeReflectionBody:
        'カードの言葉は自己省察のための参考であり、医療・法律・財務など専門的な判断に代わるものではありません。',
      noticeStorageTitle: '記録の保存について',
      noticeStorageBody:
        '書かれたインサイトノートは外部サーバーへ送信されず、お使いのブラウザ（localStorage）にのみ保存されます。ブラウザのデータ削除や機種変更を行うと消える場合があるため、必要に応じてバックアップをご利用ください。',
    },
    encyclopedia: {
      archiveSubtitle: 'LUCIDA ARCANA ARCHIVE',
      title: '78枚のタロットカード図鑑',
      closeAria: '図鑑を閉じる',
      missingImageNotice:
        '一部のカード画像が読み込めなかったため、代替フレームを表示しています。',
      backToList: '78枚の一覧へ',
      backToReading: 'カード選びに戻る',
      categoryMinor: '小アルカナ群',
      categoryMajor: '核となる22枚',
      suits: {
        wands: 'ワンド (Wands)',
        cups: 'カップ (Cups)',
        swords: 'ソード (Swords)',
        pentacles: 'ペンタクル (Pentacles)',
      },
      filters: {
        all: 'すべて',
        major: '核となる22枚',
        wands: 'ワンド',
        cups: 'カップ',
        swords: 'ソード',
        pentacles: 'ペンタクル',
      },
      symbolismAria: 'カードの象徴と問い',
      meaningTitle: '象徴と意味',
      insightTitle: '省察のまなざし',
      questionTitle: '自分への静かな問い',
      gentleActionTitle: 'ささやかな一歩の提案',
      myNotesAria: 'このカードに残した記録',
      myNotesTitle: 'このカードに残した私の記録',
      countLabel: (count) => `${count}件`,
      writeNoteOpen: 'ノートに書く',
      writeNoteClose: '閉じる',
      noteErrorEmpty: '残したい想いを少しでも入力してください。',
      noteSaved: 'インサイトノートに保存されました。',
      noteSaveError: '記録を保存できませんでした。',
      notePlaceholder: (cardName) =>
        `「${cardName}」を見つめながら浮かんだ思いを書き留めてみてください。`,
      noteTextareaAria: 'カードの省察メモを入力',
      cancel: 'キャンセル',
      saveToNotes: 'ノートに保存',
      emptyCardNotes: 'このカードに紐づけて保存した記録はまだありません。',
      openRecord: '記録を開く',
      selectedAttemptPrefix: (text) => `選んだ試み: ${text}`,
      attemptsOnlyPlaceholder: '（選んだ試みのみ記録）',
      filterTabsAria: 'カード分類フィルター',
      searchPlaceholder: 'カード名・英語名・キーワードで検索',
      searchAria: '78枚のタロットカードを検索',
      noCardsFound: '検索条件に一致するカードが見つかりません。',
      showAllCards: '全78枚を表示する',
      myRecordCount: (count) => `記録 ${count}件`,
    },
    pwa: {
      headerInstall: 'アプリを追加',
      appIconAlt: 'LUCIDAアプリアイコン',
      cardTitle: 'ホーム画面にLUCIDAを追加',
      cardDesc:
        'アプリのようにホーム画面に追加して、いつでも落ち着いて自分と向き合う時間を開けます。',
      cardButtonIOS: 'ホーム画面への追加方法',
      cardButtonInstall: 'アプリをインストール',
      iosModalTitle: 'ホーム画面にLUCIDAを追加',
      iosModalSubtitle: 'iOS Safari のご案内',
      iosModalCloseAria: '案内を閉じる',
      iosStep1Before: '1. Safariの画面下部または上部にある ',
      iosStep1Bold: '共有（Share）',
      iosStep1After: ' ボタンをタップします。',
      iosStep2Before: '2. メニューから ',
      iosStep2Bold: 'ホーム画面に追加',
      iosStep2After: ' を選びます。',
      iosStep3Before: '3. 右上の ',
      iosStep3Bold: '追加',
      iosStep3After: ' を押すとLUCIDAのアイコンが作成されます。',
      confirm: '閉じる',
    },
    reminder: {
      headerButtonAria: '私と出会う時間のリマインダー設定を開く',
      modalCloseAria: 'リマインダー設定を閉じる',
      title: '私と出会う時間',
      subtitle: '少し立ち止まり、自分の心を見つめる時間を決めてみてください。',
      toggleLabel: '内省リマインダーをオンにする',
      toggleDescActive: '設定した時間と曜日に合わせて、静かな問いかけをお届けします。',
      toggleDescPaused: 'オフにしても、設定した時刻や曜日はそのまま保存されます。',
      toggleAria: '内省リマインダーのオン・オフ',
      statusActiveBadge: 'オン',
      statusPausedBadge: '一時停止',
      statusSkippedBadge: '今日はお休み',
      timeTitle: '通知する時間',
      hourLabel: '時',
      minuteLabel: '分',
      formatHourOption: (hour) => {
        const period = hour < 12 ? '午前' : '午後';
        const h12 = hour % 12 === 0 ? 12 : hour % 12;
        return `${period} ${h12}時 (${String(hour).padStart(2, '0')})`;
      },
      formatMinuteOption: (minute) => `${String(minute).padStart(2, '0')}分`,
      formatTimeDisplay: (hour, minute) => {
        const period = hour < 12 ? '午前' : '午後';
        const h12 = hour % 12 === 0 ? 12 : hour % 12;
        return `${period} ${h12}:${String(minute).padStart(2, '0')}`;
      },
      repeatTitle: '繰り返し',
      dailyOption: '毎日',
      weekdaysShort: {
        1: '月',
        2: '火',
        3: '水',
        4: '木',
        5: '金',
        6: '土',
        0: '日',
      },
      weekdaysFull: {
        1: '月曜日',
        2: '火曜日',
        3: '水曜日',
        4: '木曜日',
        5: '金曜日',
        6: '土曜日',
        0: '日曜日',
      },
      minDayWarning: '繰り返しのために少なくとも1つの曜日を選択してください。',
      skipTodayTitle: '今日の通知をスキップ',
      skipTodayDesc: '今日だけお休みし、次回の予定日から自動で再開します。',
      skipTodayActiveNote: (nextTimeLabel) =>
        `今日の通知はスキップしました。${nextTimeLabel}から再開されます。`,
      skipTodayTomorrowLabel: '明日',
      skipTodayWeekdayLabel: (weekdayName) => `次の${weekdayName}`,
      previewTitle: 'スマホ通知のプレビュー',
      previewPhoneNow: '今',
      previewCycleButton: '別のメッセージを見る',
      previewTestButton: 'テスト通知を送る',
      testSentFeedback: 'テスト通知を送信しました。通知を開くと「今の私へ」に移動します。',
      testDeniedFeedback: 'ブラウザの通知がブロックされているため送信できませんでした。',
      testUnsupportedFeedback: 'このブラウザではシステム通知を利用できません。',
      permissionDeniedTitle: 'ブラウザの通知許可がオフになっています',
      permissionDeniedBody:
        '設定した時間と曜日は保存されています。通知を受け取るには、ブラウザのサイト設定または端末の通知設定からLUCIDAの通知を許可してください。',
      permissionDefaultTitle: '通知の許可がまだ設定されていません',
      permissionDefaultBody:
        '設定は保存されていますが、通知を表示するにはブラウザの許可が必要です。',
      permissionAllowButton: '通知を許可する',
      permissionUnsupportedBody:
        'お使いのブラウザは通知機能に対応していませんが、設定内容は端末に保存されます。',
      scopeNoticeTitle: '現在の通知動作について',
      scopeNoticeBody:
        '現在は設定の保存と、ブラウザでLUCIDAが開いている状態での通知に対応しています。アプリが完全に閉じている状態や画面ロック中の定時プッシュ通知には、今後のプッシュサーバー連携が必要です。',
      scheduleSummaryDaily: (timeStr) => `毎日 ${timeStr}`,
      scheduleSummaryWeekly: (daysStr, timeStr) => `毎週 ${daysStr} · ${timeStr}`,
    },
  },
};

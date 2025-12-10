import React, { useState, useEffect } from 'react';
import { User, AppStep } from './types';
import { Layout } from './components/Layout';
import { FaceScanModal } from './components/FaceScanModal';
import { SuccessModal } from './components/SuccessModal';
import { VirtualKeyboard } from './components/VirtualKeyboard';
import { MapPin, Lock, User as UserIcon, AlertTriangle, ShieldAlert, LogOut, Footprints, LockOpen, FileSignature } from 'lucide-react';

// Mock User Data
const USER: User = {
  name: '박예림',
  id: '22510865',
  major: '건축'
};

export default function App() {
  const [step, setStep] = useState<AppStep>(AppStep.LOGIN);
  const [timer, setTimer] = useState(292); // 04:52 in seconds
  
  // Login State
  const [password, setPassword] = useState('');
  const [showKeypad, setShowKeypad] = useState(false);

  // Warning State - Pedometer
  const [steps, setSteps] = useState(0);

  // Timer logic for Warning screen & Pedometer simulation
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (step === AppStep.WARNING && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
        // Simulate walking further away (increment steps occasionally)
        setSteps((prev) => prev + (Math.random() > 0.4 ? 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // Automatic State Transitions to simulate the "Video" flow
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined;

    if (step === AppStep.FACE_SCAN_ENTRY) {
      // Simulate scanning for 3 seconds, then success
      timeout = setTimeout(() => {
        setStep(AppStep.SUCCESS_ENTRY);
      }, 3000);
    } else if (step === AppStep.SUCCESS_ENTRY) {
      // Show success for 2 seconds, then go to Home (Checked In)
      timeout = setTimeout(() => {
        setStep(AppStep.HOME_CHECKED_IN);
      }, 2000);
    } else if (step === AppStep.FACE_SCAN_EXIT) {
      // Simulate exit scan for 3 seconds
      timeout = setTimeout(() => {
        setStep(AppStep.SUCCESS_EXIT);
      }, 3000);
    } else if (step === AppStep.SUCCESS_EXIT) {
      // Show success for 2 seconds, then trigger Warning automatically
      timeout = setTimeout(() => {
        setStep(AppStep.WARNING);
        setSteps(162); // Start with a value that triggered the alert (>150)
      }, 2000);
    } else if (step === AppStep.WARNING) {
      // Show warning for 5 seconds, let the steps increase, then Ban automatically
      timeout = setTimeout(() => {
        setStep(AppStep.BANNED);
      }, 5000);
    }

    return () => clearTimeout(timeout);
  }, [step]);

  // Password Typing Simulation
  useEffect(() => {
    if (showKeypad && password.length < 8) {
      const typingTimeout = setTimeout(() => {
        setPassword((prev) => prev + '●');
      }, 150 + Math.random() * 50); // Simulate natural typing speed
      return () => clearTimeout(typingTimeout);
    }
  }, [showKeypad, password]);

  const handleLogin = () => {
    if (password.length > 0) {
        setStep(AppStep.HOME_INITIAL);
        setShowKeypad(false);
    }
  };
  
  const handleCheckIn = () => setStep(AppStep.FACE_SCAN_ENTRY);
  const handleCheckOut = () => setStep(AppStep.FACE_SCAN_EXIT);
  // const handleSimulateBan = () => setStep(AppStep.BANNED); // No longer needed for manual trigger, but kept in logic if referenced
  const handleProfessorUnlock = () => setStep(AppStep.PROFESSOR_UNLOCK);
  
  const handleReset = () => {
    setStep(AppStep.LOGIN);
    setTimer(292);
    setPassword('');
    setShowKeypad(false);
    setSteps(0);
  }

  const handlePasswordClick = () => {
    setShowKeypad(true);
    // Optional: Clear password if they tap it again to re-type, or keep it.
    if (password.length === 8) setPassword('');
  };

  // Formatting timer mm:ss
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // --- RENDERERS ---

  if (step === AppStep.LOGIN) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden">
        <div className="mb-8 text-center transition-all duration-300" style={{ transform: showKeypad ? 'translateY(-20px)' : 'none' }}>
            <h1 className="text-4xl font-black text-blue-900 tracking-tighter flex items-center justify-center gap-1">
                <span className="text-5xl text-blue-800">YU</span>
                <div className="flex flex-col items-start text-xs font-bold text-blue-800 leading-tight ml-2">
                    <span>영남대학교</span>
                    <span>스마트 출석</span>
                </div>
            </h1>
        </div>

        <div className={`bg-white rounded-3xl shadow-xl w-full max-w-sm overflow-hidden transition-all duration-300 ${showKeypad ? 'mb-60' : ''}`}>
            <div className="flex w-full">
                <button className="flex-1 py-4 text-white bg-blue-500 font-bold text-center">학생</button>
                <button className="flex-1 py-4 text-gray-400 bg-white font-medium text-center border-b border-gray-100">교수</button>
            </div>
            
            <div className="p-8 space-y-4">
                <div className="relative">
                    <div className="absolute left-4 top-3.5 text-gray-400">
                        <UserIcon className="w-6 h-6" />
                    </div>
                    <input 
                        type="text" 
                        defaultValue="22510865"
                        readOnly={showKeypad} // Prevent native keyboard if virtual is showing
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-12 pr-4 text-lg focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="학번"
                    />
                </div>
                <div className="relative">
                    <div className="absolute left-4 top-3.5 text-gray-400">
                        <Lock className="w-6 h-6" />
                    </div>
                    <input 
                        type="text"
                        value={password}
                        onClick={handlePasswordClick}
                        readOnly // Always readOnly to force virtual keyboard
                        className={`w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-12 pr-4 text-lg focus:outline-none transition-colors ${showKeypad ? 'border-blue-500 ring-2 ring-blue-100' : ''}`}
                        placeholder="비밀번호"
                    />
                </div>

                <div className="flex items-center gap-2 mt-2">
                    <div className="w-5 h-5 rounded border border-gray-300"></div>
                    <span className="text-gray-500">자동 로그인</span>
                </div>

                <button 
                    onClick={handleLogin}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-xl text-lg shadow-lg shadow-blue-200 mt-6 transition-all active:scale-95"
                >
                    로그인
                </button>
            </div>
        </div>
        
        {!showKeypad && <p className="mt-8 text-gray-400 text-sm">앱 버전 1.0.6</p>}

        {showKeypad && <VirtualKeyboard />}
    </div>
    );
  }

  // --- MAIN APP SCREENS ---

  return (
    <Layout user={USER}>
      
      {/* 2. & 5. Home Screen (Initial & Checked In) */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 pb-20 relative">
        
        {/* Circle Button Area */}
        <div className="relative w-72 h-72 flex items-center justify-center">
            {/* Outer Glows */}
            <div className={`absolute inset-0 rounded-full opacity-10 ${step === AppStep.HOME_CHECKED_IN ? 'bg-green-500' : 'bg-blue-500'}`}></div>
            <div className={`absolute inset-4 rounded-full opacity-20 ${step === AppStep.HOME_CHECKED_IN ? 'bg-green-500' : 'bg-blue-500'}`}></div>
            
            {/* Main Button */}
            <button 
                onClick={step === AppStep.HOME_CHECKED_IN ? handleCheckOut : handleCheckIn}
                className={`
                    relative w-56 h-56 rounded-full shadow-2xl flex flex-col items-center justify-center text-white transition-all duration-500 transform active:scale-95
                    ${step === AppStep.HOME_CHECKED_IN 
                        ? 'bg-gradient-to-br from-green-400 to-green-500 shadow-green-200 border-4 border-green-50' 
                        : 'bg-blue-600 shadow-blue-200 border-4 border-blue-50'}
                `}
            >
                {step === AppStep.HOME_CHECKED_IN ? (
                    <>
                        <LogOut className="w-16 h-16 mb-2 stroke-[2.5]" />
                        <span className="text-2xl font-bold tracking-tight">출석체크(재)</span>
                        <div className="mt-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                            상태: 현재
                        </div>
                    </>
                ) : (
                    <>
                        <MapPin className="w-16 h-16 mb-2 stroke-[1.5]" />
                        <span className="text-2xl font-bold tracking-tight">출석체크</span>
                        <span className="text-blue-100 text-sm mt-1 font-medium">블루투스 + 페이스 ID</span>
                    </>
                )}
            </button>
        </div>

        {/* Footer Info */}
        <div className="mt-12 space-y-2 text-gray-500 text-sm px-4">
            <div className="flex gap-2 items-start">
                <span className="text-blue-500 font-bold">•</span>
                <p>버튼을 누르면 블루투스 인증과 AI Face ID가 동시에 활성화됩니다.</p>
            </div>
            <div className="flex gap-2 items-start">
                <span className="text-blue-500 font-bold">•</span>
                <p>강의 시간 중에 강의실을 나가면 자동 경고가 발동될 수 있습니다.</p>
            </div>
        </div>
      </div>

      {/* 3. & 6. Face Scan Modals */}
      <FaceScanModal 
        title={step === AppStep.FACE_SCAN_EXIT ? "클래스 종료 인증" : "출석 확인"} 
        isActive={step === AppStep.FACE_SCAN_ENTRY || step === AppStep.FACE_SCAN_EXIT} 
      />

      {/* 4. & 7. Success Modals */}
      <SuccessModal 
        title={step === AppStep.SUCCESS_EXIT ? "클래스 종료 인증" : "출석 확인"}
        isActive={step === AppStep.SUCCESS_ENTRY || step === AppStep.SUCCESS_EXIT}
      />

      {/* 8. Warning Screen Overlay */}
      {step === AppStep.WARNING && (
        <div className="absolute inset-0 bg-white/95 z-40 flex flex-col items-center justify-center p-6 animate-fadeIn">
            <div className="w-full max-w-sm border-4 border-red-100 rounded-3xl p-6 flex flex-col items-center bg-white shadow-xl relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-full h-2 bg-red-400"></div>

                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-4 relative mt-2">
                    <ShieldAlert className="w-10 h-10 text-red-400 opacity-20 absolute" />
                    <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>

                <h2 className="text-2xl font-bold text-red-500 mb-1">위치 이탈 감지</h2>
                <p className="text-gray-500 font-medium mb-6 text-sm">당신은 교실 구역을 떠났습니다.</p>

                {/* NEW: Pedometer / Distance Tracker Widget */}
                <div className="w-full bg-gradient-to-r from-red-50 to-white border border-red-100 rounded-xl py-3 px-4 flex items-center justify-between mb-6 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="bg-white p-2 rounded-full shadow-sm border border-red-50">
                            <Footprints className="w-5 h-5 text-red-500" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[11px] text-red-400 font-bold uppercase tracking-wider">이탈 거리 (실시간)</span>
                            <span className="text-xl font-black text-gray-800 leading-none mt-1">
                                {steps} <span className="text-sm font-medium text-gray-500">걸음</span>
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                         <div className="flex items-center gap-1 mb-1">
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                            <span className="text-[10px] text-red-500 font-bold">감지됨</span>
                         </div>
                        <span className="text-[10px] text-gray-400 font-medium bg-gray-50 px-2 py-0.5 rounded border border-gray-100">허용: 150보</span>
                    </div>
                </div>

                <div className="w-full bg-gray-50 rounded-xl py-4 flex flex-col items-center mb-4">
                    <span className="text-gray-400 text-xs font-medium mb-1">돌아올 수 있는 남은 시간</span>
                    <span className="text-3xl font-black text-red-400 tracking-widest font-mono">
                        {formatTime(timer)}
                    </span>
                </div>

                <p className="text-red-400 text-xs font-bold text-center">결석 표시를 피하기 위해 즉시 복귀하십시오.</p>
            </div>
        </div>
      )}

      {/* 9. Ban Screen Overlay */}
      {step === AppStep.BANNED && (
        <div className="absolute inset-0 bg-gray-100 z-50 flex flex-col items-center p-6 animate-fadeIn">
            <div className="w-full h-2 bg-red-600 absolute top-0 left-0"></div>
            <div className="absolute top-4 right-4 text-gray-300 text-xs">(디버그: 해제)</div>

            <div className="mt-12 w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-8">
                <ShieldAlert className="w-12 h-12 text-red-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">출석체크 이용 제한</h2>
            
            <p className="text-center text-gray-600 font-medium leading-relaxed mb-8">
                반복적인 부정 출석 시도가 감지되어<br/>
                학칙에 대한 의거해 서비스 이용이<br/>
                정지되었습니다.
            </p>

            <div className="w-full bg-red-50 border border-red-100 rounded-lg p-5 mb-8">
                <div className="mb-4">
                    <span className="text-red-500 font-bold text-sm block mb-1">징계 사유</span>
                    <span className="text-gray-900 font-bold">대리 출석 의심 및 위치 이탈 반복</span>
                </div>
                <div className="w-full h-px bg-red-100 mb-4"></div>
                <div>
                    <span className="text-red-500 font-bold text-sm block mb-1">제한 해제 일시</span>
                    <span className="text-gray-900 font-bold">2024년 6월 1일 (월) 09:00</span>
                </div>
            </div>

            <button 
                onClick={handleProfessorUnlock}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl text-lg shadow-lg shadow-blue-200 transition-all active:scale-95"
            >
                교수님께 소명하기 (제한 해제 요청)
            </button>

            <button onClick={handleReset} className="mt-4 text-gray-400 text-sm underline">
                로그아웃
            </button>

            <p className="mt-6 text-gray-400 text-sm">문의: 학사관리팀 053-810-1000</p>
        </div>
      )}

      {/* 10. Professor Unlock Success Screen */}
      {step === AppStep.PROFESSOR_UNLOCK && (
        <div className="absolute inset-0 bg-white z-50 flex flex-col items-center justify-center p-6 animate-fadeIn">
            <div className="w-full max-w-sm rounded-3xl p-8 flex flex-col items-center shadow-2xl border border-blue-50 bg-white relative overflow-hidden">
                <div className="absolute top-0 w-full h-1.5 bg-gradient-to-r from-blue-400 to-indigo-500"></div>

                <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 relative">
                    <div className="absolute inset-0 rounded-full animate-ping bg-blue-100 opacity-50"></div>
                    <LockOpen className="w-10 h-10 text-blue-600 relative z-10" />
                    <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-sm border border-blue-100">
                        <FileSignature className="w-5 h-5 text-indigo-500" />
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-2">이용 제한 해제됨</h2>
                <p className="text-center text-gray-500 text-sm leading-relaxed mb-8">
                    담당 교수님(김교수)의 권한으로<br/>
                    출석 제한이 해제되었습니다.
                </p>

                <div className="w-full bg-gray-50 rounded-xl p-4 mb-8 border border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                         <span className="text-xs text-gray-400 font-bold uppercase">처리 결과</span>
                         <span className="text-xs text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full border border-green-100">승인됨</span>
                    </div>
                    <div className="flex items-center gap-3">
                         <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <UserIcon className="w-6 h-6 text-gray-400" />
                         </div>
                         <div>
                             <p className="text-sm font-bold text-gray-900">{USER.name} ({USER.id})</p>
                             <p className="text-xs text-gray-500">현재 상태: <span className="text-blue-600 font-bold">정상</span></p>
                         </div>
                    </div>
                </div>

                <button 
                    onClick={handleReset}
                    className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl text-lg hover:bg-black transition-colors"
                >
                    확인 및 홈으로 이동
                </button>
            </div>
        </div>
      )}

    </Layout>
  );
}
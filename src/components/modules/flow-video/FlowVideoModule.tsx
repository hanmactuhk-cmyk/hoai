import React, { useState } from 'react';
import { ConfigPanel } from './ConfigPanel';
import { PromptInputSection } from './PromptInputSection';
import { TaskOutputTable } from './TaskOutputTable';
import { FlowModel, AspectRatio, VideoResolution } from '../../../types';

export const FlowVideoModule: React.FC = () => {
  // Shared Configuration State
  const [model, setModel] = useState<FlowModel>('omni_1_1_flash');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [concurrency, setConcurrency] = useState<number>(4);
  const [delaySec, setDelaySec] = useState<number>(10);
  const [outputFolder, setOutputFolder] = useState<string>('D:/HoaiStudioAutomation/Exports');
  const [enableWatermark, setEnableWatermark] = useState<boolean>(false);
  const [resolution, setResolution] = useState<VideoResolution>('1080p');
  const [duration, setDuration] = useState<number>(6);
  const [variations, setVariations] = useState<number>(1);
  const [startFrameUrl, setStartFrameUrl] = useState<string>('');
  const [endFrameUrl, setEndFrameUrl] = useState<string>('');

  return (
    <div className="flex-1 overflow-hidden p-3.5 flex flex-col xl:flex-row gap-3.5 bg-[#0b0f17]">
      {/* Cột cấu hình & Nhập liệu (Left Configuration Panel - chiếm 35% chiều rộng) */}
      <div className="w-full xl:w-[35%] flex flex-col gap-3.5 overflow-y-auto pr-1 shrink-0 max-h-full">
        <ConfigPanel
          model={model}
          setModel={setModel}
          aspectRatio={aspectRatio}
          setAspectRatio={setAspectRatio}
          concurrency={concurrency}
          setConcurrency={setConcurrency}
          delaySec={delaySec}
          setDelaySec={setDelaySec}
          outputFolder={outputFolder}
          setOutputFolder={setOutputFolder}
          enableWatermark={enableWatermark}
          setEnableWatermark={setEnableWatermark}
          resolution={resolution}
          setResolution={setResolution}
          duration={duration}
          setDuration={setDuration}
          variations={variations}
          setVariations={setVariations}
          startFrameUrl={startFrameUrl}
          setStartFrameUrl={setStartFrameUrl}
          endFrameUrl={endFrameUrl}
          setEndFrameUrl={setEndFrameUrl}
        />

        <PromptInputSection
          model={model}
          aspectRatio={aspectRatio}
          resolution={resolution}
          duration={duration}
          variations={variations}
          startFrameUrl={startFrameUrl}
          endFrameUrl={endFrameUrl}
        />
      </div>

      {/* Bảng quản lý tác vụ & Kết quả (Right Task & Output Panel - chiếm 65% chiều rộng) */}
      <div className="w-full xl:w-[65%] flex flex-col min-w-0 h-full overflow-hidden">
        <TaskOutputTable />
      </div>
    </div>
  );
};

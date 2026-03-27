"use client";

import React from "react";
import { ArrowUp, Paperclip, Square, X, StopCircle, Mic, Globe, BrainCog, FolderCode } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(" ");

interface PromptInputBoxProps {
  onSend?: (message: string, files?: File[]) => void;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
}

export const PromptInputBox = React.forwardRef<HTMLDivElement, PromptInputBoxProps>(
  ({ onSend = () => {}, isLoading = false, placeholder = "Type your message here...", className }, ref) => {
    const [input, setInput] = React.useState("");
    const [files, setFiles] = React.useState<File[]>([]);
    const [filePreviews, setFilePreviews] = React.useState<Record<string, string>>({});
    const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
    const [isRecording, setIsRecording] = React.useState(false);
    const [showSearch, setShowSearch] = React.useState(false);
    const [showThink, setShowThink] = React.useState(false);
    const [showCanvas, setShowCanvas] = React.useState(false);
    const uploadInputRef = React.useRef<HTMLInputElement>(null);
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    const hasContent = input.trim() !== "" || files.length > 0;

    const isImageFile = (file: File) => file.type.startsWith("image/");

    const processFile = (file: File) => {
      if (!isImageFile(file) || file.size > 10 * 1024 * 1024) return;
      setFiles([file]);
      const reader = new FileReader();
      reader.onload = (e) => setFilePreviews({ [file.name]: e.target?.result as string });
      reader.readAsDataURL(file);
    };

    const handleSubmit = () => {
      if (!hasContent) return;
      let prefix = "";
      if (showSearch) prefix = "[Search: ";
      else if (showThink) prefix = "[Think: ";
      else if (showCanvas) prefix = "[Canvas: ";
      const message = prefix ? `${prefix}${input}]` : input;
      onSend(message, files);
      setInput("");
      setFiles([]);
      setFilePreviews({});
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    };

    React.useEffect(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
      }
    }, [input]);

    React.useEffect(() => {
      const handlePaste = (e: ClipboardEvent) => {
        const items = e.clipboardData?.items;
        if (!items) return;
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf("image") !== -1) {
            const file = items[i].getAsFile();
            if (file) { e.preventDefault(); processFile(file); break; }
          }
        }
      };
      document.addEventListener("paste", handlePaste);
      return () => document.removeEventListener("paste", handlePaste);
    }, []);

    const Divider = () => (
      <div className="relative h-6 w-[1.5px] mx-1">
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#9b87f5]/70 to-transparent rounded-full" />
      </div>
    );

    return (
      <>
        <div
          ref={ref}
          className={cn(
            "rounded-3xl border border-[#444444] bg-[#1F2023] p-2 shadow-[0_8px_30px_rgba(0,0,0,0.24)] transition-all duration-300",
            isLoading && "border-red-500/70",
            isRecording && "border-red-500/70",
            className
          )}
        >
          {files.length > 0 && !isRecording && (
            <div className="flex flex-wrap gap-2 pb-1">
              {files.map((file, index) => (
                <div key={index} className="relative">
                  {file.type.startsWith("image/") && filePreviews[file.name] && (
                    <div className="w-16 h-16 rounded-xl overflow-hidden cursor-pointer"
                      onClick={() => setSelectedImage(filePreviews[file.name])}>
                      <img src={filePreviews[file.name]} alt={file.name} className="h-full w-full object-cover" />
                      <button onClick={(e) => { e.stopPropagation(); setFiles([]); setFilePreviews({}); }}
                        className="absolute top-1 right-1 rounded-full bg-black/70 p-0.5">
                        <X className="h-3 w-3 text-white" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className={cn("transition-all duration-300", isRecording ? "h-0 overflow-hidden opacity-0" : "opacity-100")}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={showSearch ? "Search the web..." : showThink ? "Think deeply..." : showCanvas ? "Create on canvas..." : placeholder}
              disabled={isLoading || isRecording}
              rows={1}
              className="flex w-full rounded-md border-none bg-transparent px-3 py-2.5 text-base text-gray-100 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 min-h-[44px] resize-none"
            />
          </div>

          {isRecording && (
            <div className="flex flex-col items-center justify-center w-full py-3">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                <span className="font-mono text-sm text-white/80">Recording...</span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between gap-2 p-0 pt-2">
            <div className={cn("flex items-center gap-1 transition-opacity duration-300", isRecording ? "opacity-0 invisible" : "opacity-100 visible")}>
              <button
                onClick={() => uploadInputRef.current?.click()}
                className="flex h-8 w-8 text-[#9CA3AF] cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-gray-600/30 hover:text-[#D1D5DB]"
                disabled={isRecording}
              >
                <Paperclip className="h-5 w-5" />
                <input ref={uploadInputRef} type="file" className="hidden"
                  onChange={(e) => { if (e.target.files?.[0]) processFile(e.target.files[0]); }}
                  accept="image/*" />
              </button>

              <div className="flex items-center">
                <button type="button"
                  onClick={() => { setShowSearch(p => !p); setShowThink(false); }}
                  className={cn("rounded-full transition-all flex items-center gap-1 px-2 py-1 border h-8",
                    showSearch ? "bg-[#1EAEDB]/15 border-[#1EAEDB] text-[#1EAEDB]" : "bg-transparent border-transparent text-[#9CA3AF] hover:text-[#D1D5DB]")}>
                  <div className="w-5 h-5 flex items-center justify-center">
                    <motion.div animate={{ rotate: showSearch ? 360 : 0, scale: showSearch ? 1.1 : 1 }}
                      whileHover={{ rotate: 15, scale: 1.1 }} transition={{ type: "spring", stiffness: 260, damping: 25 }}>
                      <Globe className="w-4 h-4" />
                    </motion.div>
                  </div>
                  <AnimatePresence>
                    {showSearch && (
                      <motion.span initial={{ width: 0, opacity: 0 }} animate={{ width: "auto", opacity: 1 }} exit={{ width: 0, opacity: 0 }}
                        className="text-xs overflow-hidden whitespace-nowrap text-[#1EAEDB]">Search</motion.span>
                    )}
                  </AnimatePresence>
                </button>

                <Divider />

                <button type="button"
                  onClick={() => { setShowThink(p => !p); setShowSearch(false); }}
                  className={cn("rounded-full transition-all flex items-center gap-1 px-2 py-1 border h-8",
                    showThink ? "bg-[#8B5CF6]/15 border-[#8B5CF6] text-[#8B5CF6]" : "bg-transparent border-transparent text-[#9CA3AF] hover:text-[#D1D5DB]")}>
                  <div className="w-5 h-5 flex items-center justify-center">
                    <motion.div animate={{ rotate: showThink ? 360 : 0, scale: showThink ? 1.1 : 1 }}
                      whileHover={{ rotate: 15, scale: 1.1 }} transition={{ type: "spring", stiffness: 260, damping: 25 }}>
                      <BrainCog className="w-4 h-4" />
                    </motion.div>
                  </div>
                  <AnimatePresence>
                    {showThink && (
                      <motion.span initial={{ width: 0, opacity: 0 }} animate={{ width: "auto", opacity: 1 }} exit={{ width: 0, opacity: 0 }}
                        className="text-xs overflow-hidden whitespace-nowrap text-[#8B5CF6]">Think</motion.span>
                    )}
                  </AnimatePresence>
                </button>

                <Divider />

                <button type="button"
                  onClick={() => setShowCanvas(p => !p)}
                  className={cn("rounded-full transition-all flex items-center gap-1 px-2 py-1 border h-8",
                    showCanvas ? "bg-[#F97316]/15 border-[#F97316] text-[#F97316]" : "bg-transparent border-transparent text-[#9CA3AF] hover:text-[#D1D5DB]")}>
                  <div className="w-5 h-5 flex items-center justify-center">
                    <motion.div animate={{ rotate: showCanvas ? 360 : 0, scale: showCanvas ? 1.1 : 1 }}
                      whileHover={{ rotate: 15, scale: 1.1 }} transition={{ type: "spring", stiffness: 260, damping: 25 }}>
                      <FolderCode className="w-4 h-4" />
                    </motion.div>
                  </div>
                  <AnimatePresence>
                    {showCanvas && (
                      <motion.span initial={{ width: 0, opacity: 0 }} animate={{ width: "auto", opacity: 1 }} exit={{ width: 0, opacity: 0 }}
                        className="text-xs overflow-hidden whitespace-nowrap text-[#F97316]">Canvas</motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                if (isRecording) setIsRecording(false);
                else if (hasContent) handleSubmit();
                else setIsRecording(true);
              }}
              disabled={isLoading && !hasContent}
              className={cn(
                "h-8 w-8 rounded-full inline-flex items-center justify-center font-medium transition-colors flex-shrink-0",
                isRecording ? "bg-transparent text-red-500 hover:bg-gray-600/30" :
                hasContent ? "bg-white hover:bg-white/80 text-[#1F2023]" :
                "bg-transparent text-[#9CA3AF] hover:bg-gray-600/30 hover:text-[#D1D5DB]"
              )}
            >
              {isLoading ? <Square className="h-4 w-4 fill-[#1F2023] animate-pulse" /> :
               isRecording ? <StopCircle className="h-5 w-5 text-red-500" /> :
               hasContent ? <ArrowUp className="h-4 w-4 text-[#1F2023]" /> :
               <Mic className="h-5 w-5 text-[#1F2023]" />}
            </button>
          </div>
        </div>

        {selectedImage && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center"
            onClick={() => setSelectedImage(null)}>
            <div className="relative bg-[#1F2023] rounded-2xl overflow-hidden shadow-2xl max-w-[90vw]">
              <img src={selectedImage} alt="Preview" className="w-full max-h-[80vh] object-contain rounded-2xl" />
              <button onClick={() => setSelectedImage(null)}
                className="absolute right-4 top-4 rounded-full bg-[#2E3033]/80 p-2 hover:bg-[#2E3033]">
                <X className="h-5 w-5 text-gray-200" />
              </button>
            </div>
          </div>
        )}
      </>
    );
  }
);

PromptInputBox.displayName = "PromptInputBox";
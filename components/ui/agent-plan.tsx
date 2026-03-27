"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Circle,
  CircleAlert,
  CircleDotDashed,
  CircleX,
} from "lucide-react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";

interface Subtask {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  tools?: string[];
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  level: number;
  dependencies: string[];
  subtasks: Subtask[];
}

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Chase docs from Marcus Webb",
    description: "Client has not submitted W-2 and 1099 forms",
    status: "in-progress",
    priority: "high",
    level: 0,
    dependencies: [],
    subtasks: [
      { id: "1.1", title: "Send initial document request email", description: "AI draft ready to send", status: "completed", priority: "high" },
      { id: "1.2", title: "Follow up if no response in 7 days", description: "Automated reminder scheduled", status: "in-progress", priority: "medium" },
      { id: "1.3", title: "Escalate to phone call", description: "If still no response after 14 days", status: "pending", priority: "medium" },
    ],
  },
  {
    id: "2",
    title: "Respond to David Kim IRS notice",
    description: "CP2000 notice received — deadline April 12",
    status: "need-help",
    priority: "high",
    level: 0,
    dependencies: [],
    subtasks: [
      { id: "2.1", title: "Review notice details", description: "Identify discrepancy amount and tax year", status: "completed", priority: "high" },
      { id: "2.2", title: "Draft response letter", description: "Use IRS notice tracker to generate draft", status: "in-progress", priority: "high" },
      { id: "2.3", title: "Client review and sign off", description: "Send draft to David for approval", status: "pending", priority: "high" },
    ],
  },
  {
    id: "3",
    title: "Review Priya Nair return",
    description: "1065 partnership return ready for final review",
    status: "pending",
    priority: "medium",
    level: 1,
    dependencies: ["2"],
    subtasks: [
      { id: "3.1", title: "Check K-1 allocations", description: "Verify partner percentages match operating agreement", status: "pending", priority: "high" },
      { id: "3.2", title: "Review depreciation schedules", description: "Confirm asset additions and disposals", status: "pending", priority: "medium" },
    ],
  },
  {
    id: "4",
    title: "Send Q1 estimated tax reminders",
    description: "April 15 deadline for Q1 2026 estimated payments",
    status: "pending",
    priority: "medium",
    level: 0,
    dependencies: [],
    subtasks: [
      { id: "4.1", title: "Generate client list for estimated taxes", description: "Pull all clients with estimated tax obligations", status: "pending", priority: "medium" },
      { id: "4.2", title: "Draft reminder emails", description: "AI batch draft for all affected clients", status: "pending", priority: "medium" },
      { id: "4.3", title: "Send and log communications", description: "Send via Clerq and log under SSTS 7", status: "pending", priority: "low" },
    ],
  },
];

export default function Plan() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [expandedTasks, setExpandedTasks] = useState<string[]>(["1"]);
  const [expandedSubtasks, setExpandedSubtasks] = useState<{ [key: string]: boolean }>({});

  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  const toggleTaskExpansion = (taskId: string) => {
    setExpandedTasks((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  };

  const toggleSubtaskExpansion = (taskId: string, subtaskId: string) => {
    const key = `${taskId}-${subtaskId}`;
    setExpandedSubtasks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleSubtaskStatus = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const updatedSubtasks = task.subtasks.map((subtask) => {
            if (subtask.id === subtaskId) {
              return { ...subtask, status: subtask.status === "completed" ? "pending" : "completed" };
            }
            return subtask;
          });
          const allDone = updatedSubtasks.every((s) => s.status === "completed");
          return { ...task, subtasks: updatedSubtasks, status: allDone ? "completed" : task.status };
        }
        return task;
      })
    );
  };

  const subtaskListVariants = {
    hidden: { opacity: 0, height: 0, overflow: "hidden" },
    visible: {
      height: "auto", opacity: 1, overflow: "visible",
      transition: { duration: 0.25, staggerChildren: prefersReducedMotion ? 0 : 0.05, when: "beforeChildren" },
    },
    exit: { height: 0, opacity: 0, overflow: "hidden", transition: { duration: 0.2 } },
  };

  const subtaskVariants = {
    hidden: { opacity: 0, x: prefersReducedMotion ? 0 : -10 },
    visible: { opacity: 1, x: 0, transition: { type: "spring" as const, stiffness: 500, damping: 25 } },
    exit: { opacity: 0, x: prefersReducedMotion ? 0 : -10, transition: { duration: 0.15 } },
  };

  return (
    <div className="text-[#e8e8ea] overflow-auto">
      <LayoutGroup>
        <div className="p-2 overflow-hidden">
          <ul className="space-y-1 overflow-hidden">
            {tasks.map((task, index) => {
              const isExpanded = expandedTasks.includes(task.id);
              const isCompleted = task.status === "completed";

              return (
                <motion.li
                  key={task.id}
                  className={index !== 0 ? "mt-1 pt-2" : ""}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="group flex items-center px-3 py-1.5 rounded-md hover:bg-white/5 transition-colors">
                    <div className="mr-2 flex-shrink-0">
                      {task.status === "completed" ? (
                        <CheckCircle2 className="h-4 w-4 text-[#34d399]" />
                      ) : task.status === "in-progress" ? (
                        <CircleDotDashed className="h-4 w-4 text-[#4f8ef7]" />
                      ) : task.status === "need-help" ? (
                        <CircleAlert className="h-4 w-4 text-[#f59e0b]" />
                      ) : task.status === "failed" ? (
                        <CircleX className="h-4 w-4 text-[#f87171]" />
                      ) : (
                        <Circle className="h-4 w-4 text-[#555]" />
                      )}
                    </div>

                    <div
                      className="flex min-w-0 flex-grow cursor-pointer items-center justify-between"
                      onClick={() => toggleTaskExpansion(task.id)}
                    >
                      <div className="mr-2 flex-1 truncate">
                        <span className={`text-[13px] ${isCompleted ? "text-[#555] line-through" : "text-[#ccc]"}`}>
                          {task.title}
                        </span>
                      </div>
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-[4px] flex-shrink-0 ${
                        task.status === "completed" ? "bg-[#0f2820] text-[#34d399]"
                        : task.status === "in-progress" ? "bg-[#1a2d4a] text-[#4f8ef7]"
                        : task.status === "need-help" ? "bg-[#2a1f0e] text-[#f59e0b]"
                        : task.status === "failed" ? "bg-[#2a1010] text-[#f87171]"
                        : "bg-[#1a1a1e] text-[#555]"
                      }`}>
                        {task.status}
                      </span>
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {isExpanded && task.subtasks.length > 0 && (
                      <motion.div
                        className="relative overflow-hidden"
                        variants={subtaskListVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        layout
                      >
                        <div className="absolute top-0 bottom-0 left-[20px] border-l border-dashed border-[#333]" />
                        <ul className="mt-1 mr-2 mb-1.5 ml-3 space-y-0.5">
                          {task.subtasks.map((subtask) => {
                            const subtaskKey = `${task.id}-${subtask.id}`;
                            const isSubtaskExpanded = expandedSubtasks[subtaskKey];

                            return (
                              <motion.li
                                key={subtask.id}
                                className="flex flex-col py-0.5 pl-6 cursor-pointer"
                                onClick={() => toggleSubtaskExpansion(task.id, subtask.id)}
                                variants={subtaskVariants}
                                layout
                              >
                                <div className="flex flex-1 items-center rounded-md p-1 hover:bg-white/5 transition-colors">
                                  <div
                                    className="mr-2 flex-shrink-0"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleSubtaskStatus(task.id, subtask.id);
                                    }}
                                  >
                                    {subtask.status === "completed" ? (
                                      <CheckCircle2 className="h-3.5 w-3.5 text-[#34d399]" />
                                    ) : subtask.status === "in-progress" ? (
                                      <CircleDotDashed className="h-3.5 w-3.5 text-[#4f8ef7]" />
                                    ) : subtask.status === "need-help" ? (
                                      <CircleAlert className="h-3.5 w-3.5 text-[#f59e0b]" />
                                    ) : (
                                      <Circle className="h-3.5 w-3.5 text-[#555]" />
                                    )}
                                  </div>
                                  <span className={`text-[12px] ${subtask.status === "completed" ? "text-[#555] line-through" : "text-[#aaa]"}`}>
                                    {subtask.title}
                                  </span>
                                </div>

                                <AnimatePresence>
                                  {isSubtaskExpanded && (
                                    <motion.div
                                      className="text-[#555] border-l border-dashed border-[#333] mt-1 ml-1.5 pl-5 text-[11px] overflow-hidden"
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: "auto" }}
                                      exit={{ opacity: 0, height: 0 }}
                                    >
                                      <p className="py-1">{subtask.description}</p>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </motion.li>
                            );
                          })}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </LayoutGroup>
    </div>
  );
}
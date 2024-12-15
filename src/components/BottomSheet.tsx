import type React from "react";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const closedTranslateY = 100; // Initial translateY is 100% (closed)
const openTranslateY = 0;

const SheetContainer = styled.div<{ translatey: number }>`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50%;
  background: white;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
  transform: translateY(${({ translatey }) => translatey}%);
  z-index: 1000;
`;

const SheetContent = styled.div`
  padding: 20px;
  overflow-y: auto;
  height: 100%;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 2rem;
  right: 3rem;
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;

  @media (max-width: 768px) {
    top: 1rem;
    right: 1rem;
  }
`;

const DragHandle = styled.div`
  width: 5rem;
  height: 0.6rem;
  background: #ccc;
  border-radius: 5px;
  position: absolute;
  top: -2.5rem;
  left: 50%;
  transform: translateX(-50%);
  cursor: grab;
`;

interface BottomSheetProps {
  onClose: () => void;
  children: React.ReactNode;
}

const BottomSheet: React.FC<BottomSheetProps> = ({ onClose, children }) => {
  const [translateY, setTranslateY] = useState(closedTranslateY);
  const [isOpen, setIsOpen] = useState(false);
  const startY = useRef(0);
  const currentY = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerHeight = window.innerHeight / 2;

  // biome-ignore lint/correctness/useExhaustiveDependencies: No need to react to changes in translateY or onClose
  useEffect(() => {
    console.log("isDragging", isDragging);
    if (isDragging) {
      document.body.style.userSelect = "none"; // Disable text selection
    } else {
      document.body.style.userSelect = ""; // Re-enable text selection
      // If stopped dragging and moved more than 20% change open state
      if (isOpen) {
        if (translateY > 20) {
          setTranslateY(closedTranslateY);
          setIsOpen(false);
          onClose();
        } else {
          setTranslateY(openTranslateY);
        }
      } else {
        if (translateY < 80) {
          setTranslateY(openTranslateY);
          setIsOpen(true);
        } else {
          setTranslateY(closedTranslateY);
        }
      }
    }
  }, [isDragging]);

  const onCloseButtonClicked = () => {
    setIsOpen(false);
    setTranslateY(closedTranslateY);
    onClose();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    startY.current = e.clientY;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    currentY.current = e.clientY;
    let diffY: number;
    let newTranslateY: number;
    // Dragging up
    if (startY.current > currentY.current) {
      if (isOpen) {
        // If open, don't allow dragging up
        return;
      }
      diffY = startY.current - currentY.current;
      newTranslateY = Math.min(closedTranslateY - (diffY / containerHeight) * 100, 100);
      setTranslateY(newTranslateY);
    }
    // Dragging down
    else {
      if (!isOpen) {
        // If closed, don't allow dragging down
        return;
      }
      diffY = currentY.current - startY.current;
      newTranslateY = Math.min(closedTranslateY - (diffY / containerHeight) * 100, 100);
      setTranslateY(100 - newTranslateY);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  // Add touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    //Convert to MouseEvent
    const mouseEvent = {
      clientX: e.touches[0].clientX,
      clientY: e.touches[0].clientY,
    };
    handleMouseDown(mouseEvent as unknown as React.MouseEvent);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // Prevent default scrolling behavior
    e.preventDefault();

    //Convert to MouseEvent
    const mouseEvent = {
      clientX: e.touches[0].clientX,
      clientY: e.touches[0].clientY,
    };
    handleMouseMove(mouseEvent as MouseEvent);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    //Convert to MouseEvent
    const mouseEvent = {
      clientX: e.touches[0].clientX,
      clientY: e.touches[0].clientY,
    };
    handleMouseMove(mouseEvent as MouseEvent);
  };

  return (
    <SheetContainer translatey={translateY}>
      <DragHandle
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />
      <CloseButton onClick={onCloseButtonClicked}>&times;</CloseButton>
      <SheetContent>{children}</SheetContent>
    </SheetContainer>
  );
};

export default BottomSheet;

import styled, { keyframes } from "styled-components";

const flowStepReveal = keyframes`
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const arrowPulse = keyframes`
  0%, 100% {
    opacity: 0.35;
    transform: translateX(0);
  }
  50% {
    opacity: 0.9;
    transform: translateX(2px);
  }
`;

export const OverviewHero = styled.div`
  display: grid;
  gap: 14px;
  grid-template-columns: minmax(0, 1.25fr) minmax(280px, 0.75fr);

  @media (max-width: 920px) {
    grid-template-columns: 1fr;
  }
`;

export const OverviewLead = styled.section`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.control};
  background: linear-gradient(180deg, ${({ theme }) => theme.colors.surfaceStrong} 0%, ${({ theme }) => theme.colors.panelMuted} 100%);
  padding: 18px;
  display: grid;
  gap: 12px;
`;

export const OverviewHighlight = styled.section`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.control};
  background: ${({ theme }) => theme.colors.panelMuted};
  padding: 18px;
  display: grid;
  gap: 12px;
  align-content: start;
`;

export const OverviewColumns = styled.div`
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(2, minmax(0, 1fr));

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

export const OverviewBlock = styled.section`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.control};
  background: ${({ theme }) => theme.colors.panelMuted};
  padding: 16px;
  display: grid;
  gap: 10px;
`;

export const FlowGrid = styled.div`
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(3, minmax(0, 1fr));

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const FlowRail = styled.div`
  display: grid;
  gap: 12px;
`;

export const FlowSequence = styled.div`
  display: contents;
`;

export const FlowNode = styled.div`
  display: block;
`;

export const FlowStepCard = styled.article<{ $delayMs: number }>`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.control};
  background: linear-gradient(180deg, ${({ theme }) => theme.colors.panelMuted} 0%, ${({ theme }) => theme.colors.panel} 100%);
  padding: 14px;
  display: grid;
  gap: 10px;
  width: 100%;
  min-height: 146px;
  animation: ${flowStepReveal} 0.35s ease both;
  animation-delay: ${({ $delayMs }) => `${$delayMs}ms`};
`;

export const FlowHead = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: space-between;
`;

export const FlowTitle = styled.h3`
  margin: 0;
  font-size: 0.92rem;
  font-weight: 700;
`;

export const FlowDetail = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.82rem;
  line-height: 1.55;
`;

export const FlowArrow = styled.span`
  color: ${({ theme }) => theme.colors.accent};
  font-size: 1rem;
  line-height: 1;
  animation: ${arrowPulse} 1.2s ease-in-out infinite;
  display: none;
`;

export const FlowMeta = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
`;

export const FlowIndex = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  background: ${({ theme }) => theme.colors.accentSoft};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 0.76rem;
  font-weight: 700;
`;

export const IconWrap = styled.span`
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.accentStrong};
  background: ${({ theme }) => theme.colors.surface};
`;

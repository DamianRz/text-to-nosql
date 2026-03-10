import { Button, MutedText } from "../chatMongo.styles";
import {
  Sidebar,
  SidebarBrand,
  SidebarLogo,
  SidebarMetaItem,
  SidebarMetaList,
  SidebarNav,
  SidebarNavButton,
  SidebarProject,
  SidebarProjectName,
  SidebarSection,
  SidebarSectionTitle
} from "../chatMongo.styles";
import type { CopyDictionary, DemoCase, DemoId, Language } from "../chatMongo.types";

interface ChatMongoSidebarProps {
  copy: CopyDictionary;
  demos: DemoCase[];
  selectedDemoId: DemoId;
  language: Language;
  experienceMode: "hosted" | "local";
  selectedModel: string;
  onSelectDemo: (id: DemoId) => void;
  onLoadDemo: () => void;
  onRunDemo: () => Promise<void>;
  isBusy: boolean;
  isInteractive: boolean;
}

export function ChatMongoSidebar({
  copy,
  demos,
  selectedDemoId,
  language,
  experienceMode,
  selectedModel,
  onSelectDemo,
  onLoadDemo,
  onRunDemo,
  isBusy,
  isInteractive
}: ChatMongoSidebarProps) {
  return (
    <Sidebar>
      <SidebarBrand>
        <SidebarLogo>Natural to MongoDB</SidebarLogo>
        <SidebarProject>
          <SidebarProjectName>Natural to MongoDB</SidebarProjectName>
        </SidebarProject>
      </SidebarBrand>

      <SidebarSection>
        <SidebarSectionTitle>{copy.sidebarDemosTitle}</SidebarSectionTitle>
        <SidebarNav>
          {demos.map((demo) => (
            <SidebarNavButton
              key={demo.id}
              type="button"
              $active={demo.id === selectedDemoId}
              onClick={() => onSelectDemo(demo.id)}
            >
              {demo.label}
            </SidebarNavButton>
          ))}
        </SidebarNav>
        <SidebarNav>
          <Button type="button" $variant="ghost" onClick={onLoadDemo} disabled={!isInteractive}>
            {copy.demoLoadButton}
          </Button>
          <Button type="button" onClick={() => void onRunDemo()} disabled={isBusy || !isInteractive}>
            {copy.demoRunButton}
          </Button>
        </SidebarNav>
      </SidebarSection>

      <SidebarSection>
        <SidebarSectionTitle>{copy.sidebarSettingsTitle}</SidebarSectionTitle>
        <SidebarMetaList>
          <SidebarMetaItem>
            <MutedText>{copy.previewModeLabel}</MutedText>
            <span>{experienceMode === "local" ? copy.previewLocalLabel : copy.previewHostedLabel}</span>
          </SidebarMetaItem>
          <SidebarMetaItem>
            <MutedText>{copy.localModelLabel}</MutedText>
            <span>{selectedModel}</span>
          </SidebarMetaItem>
          <SidebarMetaItem>
            <MutedText>{copy.languageLabel}</MutedText>
            <span>{language === "es" ? copy.languageSpanish : copy.languageEnglish}</span>
          </SidebarMetaItem>
        </SidebarMetaList>
      </SidebarSection>
    </Sidebar>
  );
}

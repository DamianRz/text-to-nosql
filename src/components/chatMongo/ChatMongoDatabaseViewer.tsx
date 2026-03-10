import { useEffect, useMemo, useState } from "react";
import type { CopyDictionary, DatabaseCollectionView } from "../chatMongo.types";
import {
  DatabaseCollectionButton,
  DatabaseCount,
  DatabaseRecordItem,
  DatabaseRecordList,
  DatabaseRecordPre,
  DatabaseRecords,
  DatabaseSidebar,
  DatabaseViewer,
  DatabaseViewerLayout,
  InfoText,
  MutedText,
  PanelTitle,
  SectionHeader,
  SectionLabel
} from "../chatMongo.styles";

interface ChatMongoDatabaseViewerProps {
  copy: CopyDictionary;
  collections: DatabaseCollectionView[];
  preferredCollectionName?: string;
}

const stringify = (value: unknown): string => JSON.stringify(value, null, 2);

export function ChatMongoDatabaseViewer({ copy, collections, preferredCollectionName }: ChatMongoDatabaseViewerProps) {
  const defaultCollectionName = collections[0]?.name ?? "";
  const [selectedCollectionName, setSelectedCollectionName] = useState(defaultCollectionName);

  useEffect(() => {
    if (!preferredCollectionName) {
      return;
    }

    if (collections.some((collection) => collection.name === preferredCollectionName)) {
      setSelectedCollectionName(preferredCollectionName);
    }
  }, [collections, preferredCollectionName]);

  useEffect(() => {
    if (collections.some((collection) => collection.name === selectedCollectionName)) {
      return;
    }

    setSelectedCollectionName(defaultCollectionName);
  }, [collections, defaultCollectionName, selectedCollectionName]);

  const selectedCollection = useMemo(
    () => collections.find((collection) => collection.name === selectedCollectionName) ?? collections[0],
    [collections, selectedCollectionName]
  );

  return (
    <DatabaseViewer aria-label="local-database-viewer">
      <SectionHeader>
        <div>
          <PanelTitle>{copy.databaseViewerTitle}</PanelTitle>
          <MutedText>{copy.databaseViewerDescription}</MutedText>
        </div>
      </SectionHeader>

      <DatabaseViewerLayout>
        <DatabaseSidebar>
          <SectionHeader>
            <SectionLabel>{copy.databaseCollectionsTitle}</SectionLabel>
            <MutedText>{collections.length}</MutedText>
          </SectionHeader>
          {collections.length === 0 ? (
            <InfoText>{copy.databaseEmptyState}</InfoText>
          ) : (
            collections.map((collection) => (
              <DatabaseCollectionButton
                key={collection.name}
                type="button"
                $active={collection.name === selectedCollection?.name}
                onClick={() => setSelectedCollectionName(collection.name)}
              >
                <span>{collection.name}</span>
                <DatabaseCount>{collection.documents.length}</DatabaseCount>
              </DatabaseCollectionButton>
            ))
          )}
        </DatabaseSidebar>

        <DatabaseRecords>
          <SectionLabel>{selectedCollection ? `${copy.databaseRecordsTitle}: ${selectedCollection.name}` : copy.databaseRecordsTitle}</SectionLabel>
          {!selectedCollection || selectedCollection.documents.length === 0 ? (
            <InfoText>{copy.databaseEmptyCollection}</InfoText>
          ) : (
            <DatabaseRecordList>
              {selectedCollection.documents.map((document, index) => (
                <DatabaseRecordItem key={String(document._id ?? index)}>
                  <DatabaseRecordPre>{stringify(document)}</DatabaseRecordPre>
                </DatabaseRecordItem>
              ))}
            </DatabaseRecordList>
          )}
        </DatabaseRecords>
      </DatabaseViewerLayout>
    </DatabaseViewer>
  );
}

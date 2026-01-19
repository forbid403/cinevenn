
import React from 'react';
import { ContentItem, ViewMode } from '../types';
import ContentCardList from './ContentCardList';
import ContentCardGrid from './ContentCardGrid';

interface ContentCardProps {
  item: ContentItem;
  viewMode: ViewMode;
  selectedCountries: string[];
}

const ContentCard: React.FC<ContentCardProps> = ({ item, viewMode, selectedCountries }) => {
  if (viewMode === 'list') {
    return <ContentCardList item={item} selectedCountries={selectedCountries} />;
  }

  return <ContentCardGrid item={item} selectedCountries={selectedCountries} />;
};

export default ContentCard;

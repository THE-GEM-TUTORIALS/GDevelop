// @flow
import * as React from 'react';
import SearchBar from '../../UI/SearchBar';
import { Column, Line } from '../../UI/Grid';
import Background from '../../UI/Background';
import ScrollView from '../../UI/ScrollView';
import { type Resource } from '../../Utils/GDevelopServices/Asset';
import { FiltersChooser } from '../FiltersChooser';
import { ResourceStoreContext } from './ResourceStoreContext';
import { SearchResults } from '../SearchResults';
import { ResourceCard } from './ResourceCard';

const styles = {
  searchBar: {
    // TODO: Can we put this in the search bar by default?
    flexShrink: 0,
  },
};

type Props = {
  onChoose: Resource => void,
  resourceKind: string,
};

export const ResourceStore = ({ onChoose, resourceKind }: Props) => {
  const {
    filters,
    searchResults,
    error,
    fetchResourcesAndFilters,
    filtersState,
    searchText,
    setSearchText,
  } = React.useContext(ResourceStoreContext);

  React.useEffect(
    () => {
      fetchResourcesAndFilters();
    },
    [fetchResourcesAndFilters]
  );

  const searchResultsForResourceKind = searchResults
    ? searchResults.filter(resource => resource.type === resourceKind)
    : null;

  return (
    <Column expand noMargin useFullHeight>
      <SearchBar
        value={searchText}
        onChange={setSearchText}
        onRequestSearch={() => {}}
        style={styles.searchBar}
      />
      <Line
        overflow={
          'hidden' /* Somehow required on Chrome/Firefox to avoid children growing (but not on Safari) */
        }
      >
        <Background noFullHeight noExpand width={250}>
          <ScrollView>
            <FiltersChooser
              allFilters={filters}
              filtersState={filtersState}
              error={error}
            />
          </ScrollView>
        </Background>
        <SearchResults
          baseSize={128}
          onRetry={fetchResourcesAndFilters}
          error={error}
          searchItems={searchResultsForResourceKind}
          renderSearchItem={(resource, size) => (
            <ResourceCard
              size={size}
              resource={resource}
              onChoose={() => onChoose(resource)}
            />
          )}
        />
      </Line>
    </Column>
  );
};

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { View, TouchableOpacity, Platform, Dimensions, findNodeHandle } from 'react-native';

// Enhanced spatial navigation context
interface SpatialNavigationContextType {
  focusedElement: string | null;
  registerFocusable: (key: string, element: any) => void;
  unregisterFocusable: (key: string) => void;
  focusElement: (key: string) => void;
  getNextFocusable: (direction: string, currentKey: string) => string | null;
  isTV: boolean;
}

const SpatialNavigationContext = createContext<SpatialNavigationContextType | null>(null);

// SpatialNavigationRoot component - provides the navigation context
export const SpatialNavigationRoot: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [focusedElement, setFocusedElement] = useState<string | null>(null);
  const [focusableElements, setFocusableElements] = useState<Map<string, any>>(new Map());
  const [elementPositions, setElementPositions] = useState<Map<string, { x: number; y: number; width: number; height: number }>>(new Map());

  const isTV = Platform.OS === 'android' && Platform.isTV;

  const registerFocusable = useCallback((key: string, element: any) => {
    setFocusableElements(prev => new Map(prev.set(key, element)));
  }, []);

  const unregisterFocusable = useCallback((key: string) => {
    setFocusableElements(prev => {
      const newMap = new Map(prev);
      newMap.delete(key);
      return newMap;
    });
  }, []);

  const focusElement = useCallback((key: string) => {
    if (focusableElements.has(key)) {
      setFocusedElement(key);
    }
  }, [focusableElements]);

  // Calculate spatial navigation based on element positions
  const getNextFocusable = (direction: string, currentKey: string): string | null => {
    const currentPos = elementPositions.get(currentKey);
    if (!currentPos) return null;

    let bestCandidate: { key: string; distance: number; directionScore: number } | null = null;

    focusableElements.forEach((element, key) => {
      if (key === currentKey) return;

      const pos = elementPositions.get(key);
      if (!pos) return;

      let directionScore = 0;
      let distance = 0;

      switch (direction) {
        case 'UP':
          if (pos.y + pos.height < currentPos.y) {
            directionScore = currentPos.y - (pos.y + pos.height);
            distance = Math.abs(pos.x + pos.width/2 - (currentPos.x + currentPos.width/2));
          }
          break;
        case 'DOWN':
          if (pos.y > currentPos.y + currentPos.height) {
            directionScore = pos.y - (currentPos.y + currentPos.height);
            distance = Math.abs(pos.x + pos.width/2 - (currentPos.x + currentPos.width/2));
          }
          break;
        case 'LEFT':
          if (pos.x + pos.width < currentPos.x) {
            directionScore = currentPos.x - (pos.x + pos.width);
            distance = Math.abs(pos.y + pos.height/2 - (currentPos.y + currentPos.height/2));
          }
          break;
        case 'RIGHT':
          if (pos.x > currentPos.x + currentPos.width) {
            directionScore = pos.x - (currentPos.x + currentPos.width);
            distance = Math.abs(pos.y + pos.height/2 - (currentPos.y + currentPos.height/2));
          }
          break;
      }

      if (directionScore > 0) {
        const totalScore = directionScore + (1 / (distance + 1)); // Prefer closer elements

        if (!bestCandidate || totalScore > bestCandidate.directionScore) {
          bestCandidate = { key, distance, directionScore: totalScore };
        }
      }
    });

    return bestCandidate ? (bestCandidate as any).key : null;
  };

  // Handle TV remote navigation
  useEffect(() => {
    if (!isTV) return;

    const handleKeyDown = (event: any) => {
      if (!focusedElement || !event.keyCode) return;

      let direction: string | null = null;

      switch (event.keyCode) {
        case 19: // DPAD_UP
          direction = 'UP';
          break;
        case 20: // DPAD_DOWN
          direction = 'DOWN';
          break;
        case 21: // DPAD_LEFT
          direction = 'LEFT';
          break;
        case 22: // DPAD_RIGHT
          direction = 'RIGHT';
          break;
        case 23: // DPAD_CENTER (SELECT)
          // Trigger onSelect for focused element
          const focusedElementRef = focusableElements.get(focusedElement);
          if (focusedElementRef?.props?.onSelect) {
            focusedElementRef.props.onSelect();
          }
          return;
      }

      if (direction) {
        const nextFocusable = getNextFocusable(direction, focusedElement);
        if (nextFocusable) {
          focusElement(nextFocusable);
        }
      }
    };

    try {
      const { DeviceEventEmitter } = require('react-native');
      const subscription = DeviceEventEmitter.addListener('hardwareKeyDown', handleKeyDown);

      return () => subscription.remove();
    } catch (error) {
      console.log('TV key event listener not available:', error);
    }
  }, [focusedElement, focusableElements, elementPositions, isTV]);

  const contextValue: SpatialNavigationContextType = {
    focusedElement,
    registerFocusable,
    unregisterFocusable,
    focusElement,
    getNextFocusable,
    isTV,
  };

  return (
    <SpatialNavigationContext.Provider value={contextValue}>
      <View style={{ flex: 1 }}>
        {children}
      </View>
    </SpatialNavigationContext.Provider>
  );
};

// Hook to use spatial navigation context
export const useSpatialNavigation = () => {
  const context = useContext(SpatialNavigationContext);
  if (!context) {
    throw new Error('useSpatialNavigation must be used within a SpatialNavigationRoot');
  }
  return context;
};

// SpatialNavigationFocusableView component - makes components focusable
export const SpatialNavigationFocusableView: React.FC<{
  children: React.ReactNode;
  onSelect?: () => void;
  style?: any;
  onFocus?: () => void;
  onBlur?: () => void;
  focusKey?: string;
  disabled?: boolean;
}> = ({ children, onSelect, style, onFocus, onBlur, focusKey, disabled = false }) => {
  const { focusedElement, registerFocusable, unregisterFocusable, focusElement, isTV } = useSpatialNavigation();
  const elementRef = useRef<View>(null);
  const [elementPosition, setElementPosition] = useState<{ x: number; y: number; width: number; height: number } | null>(null);

  // Register/unregister with context
  useEffect(() => {
    if (focusKey && !disabled) {
      registerFocusable(focusKey, { elementRef, props: { onSelect, onFocus, onBlur } });
      return () => unregisterFocusable(focusKey);
    }
  }, [focusKey, disabled, registerFocusable, unregisterFocusable]);

  // Update element position for spatial calculations
  useEffect(() => {
    if (elementRef.current && focusKey) {
      const updatePosition = () => {
        try {
          const handle = findNodeHandle(elementRef.current);
          if (handle) {
            // Note: In a real implementation, you'd need to use a library like react-native-measureme
            // to get the actual on-screen position of the element
            // For now, we'll use a simplified approach
            setElementPosition({
              x: 0,
              y: 0,
              width: Dimensions.get('window').width,
              height: Dimensions.get('window').height
            });
          }
        } catch (error) {
          console.log('Error updating element position:', error);
        }
      };

      updatePosition();
      const interval = setInterval(updatePosition, 1000); // Update position periodically

      return () => clearInterval(interval);
    }
  }, [focusKey]);

  // Handle focus changes
  useEffect(() => {
    if (focusKey && focusedElement === focusKey && onFocus) {
      onFocus();
    } else if (focusKey && focusedElement !== focusKey && onBlur) {
      onBlur();
    }
  }, [focusedElement, focusKey, onFocus, onBlur]);

  const isFocused = focusedElement === focusKey;

  // Enhanced TouchableOpacity with TV-specific props for better remote navigation
  return (
    <TouchableOpacity
      ref={elementRef}
      style={[
        style,
        isFocused && !disabled && styles.focused,
        disabled && styles.disabled
      ]}
      onPress={onSelect}
      onFocus={onFocus}
      onBlur={onBlur}
      activeOpacity={0.8}
      // TV-specific props for better remote navigation
      focusable={isTV && !disabled}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={focusKey || 'Focusable item'}
      accessibilityState={isFocused ? { selected: true } : {}}
      // Enhanced focus properties for better navigation
      accessibilityHint={focusKey?.includes('card-') ? 'Navigate with D-pad, press SELECT to open' : undefined}
      // TV platform specific props
      {...(isTV && {
        hasTVPreferredFocus: focusKey === 'drawer-button',
        nextFocusUp: undefined, // These would need proper implementation
        nextFocusDown: undefined,
        nextFocusLeft: undefined,
        nextFocusRight: undefined,
      })}
    >
      {children}
    </TouchableOpacity>
  );
};

// Export SpatialNavigationNode for compatibility (if needed)
export const SpatialNavigationNode = SpatialNavigationFocusableView;

const styles = {
  focused: {
    // Enhanced focus styling will be applied by individual components
  },
  disabled: {
    opacity: 0.5,
  },
};

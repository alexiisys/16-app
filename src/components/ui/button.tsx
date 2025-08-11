import React, { type PropsWithChildren } from 'react';
import { TouchableOpacity, type View } from 'react-native';
import { Text } from 'react-native';
import { type TouchableProps } from 'react-native-svg';
import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

const button = tv({
  slots: {
    container: 'flex flex-row items-center justify-center gap-2 rounded-lg',
    label: 'font-montserrat-600 text-lg ',
  },

  variants: {
    variant: {
      default: {
        container: 'bg-orange dark:bg-orange2',
        label: 'text-white',
      },
      secondary: {
        container: 'bg-white shadow-md',
        label: 'text-blue',
      },
      inactive: {
        container: 'bg-lightGrey2',
        label: 'text-black dark:text-white',
      },
    },
    size: {
      default: {
        container: 'px-4 py-3',
      },
      sm: {
        container: 'px-2 py-1',
      },
    },
    disabled: {
      true: {
        container: 'bg-neutral-300 dark:bg-neutral-300',
        label: 'text-neutral-600 dark:text-neutral-600',
      },
    },
    fullWidth: {
      true: {
        container: '',
      },
      false: {
        container: 'self-center',
      },
    },
  },
  defaultVariants: {
    variant: 'default',
    disabled: false,
    fullWidth: true,
  },
});

type ButtonVariants = VariantProps<typeof button>;
interface Props
  extends ButtonVariants,
    Omit<PropsWithChildren<TouchableProps>, 'disabled'> {
  label?: string;
  loading?: boolean;
  className?: string;
  textClassName?: string;
  testID?: string;
  icon?: React.ReactNode;
}

export const Button = React.forwardRef<View, Props>(
  (
    {
      label: text,
      loading = false,
      variant = 'default',
      disabled = false,
      size = 'default',
      className = '',
      testID,
      icon,
      textClassName = '',
      ...props
    },
    ref
  ) => {
    const styles = React.useMemo(
      () => button({ variant, disabled, size }),
      [variant, disabled, size]
    );

    return (
      <TouchableOpacity
        disabled={disabled || loading}
        className={styles.container({ className })}
        {...props}
        ref={ref}
        testID={testID}
      >
        {props.children ? (
          props.children
        ) : (
          <>
            {icon}
            {text && (
              <Text
                testID={testID ? `${testID}-label` : undefined}
                className={styles.label({ className: textClassName })}
              >
                {text}
              </Text>
            )}
          </>
        )}
      </TouchableOpacity>
    );
  }
);

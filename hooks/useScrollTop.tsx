import { useState, useEffect, useCallback } from "react";

export const useScrollTop = (threshold = 10) => {
  const [scrolled, setScrolled] = useState(false);

  const handleScroll = useCallback(() => {
    const marketingPageWrapper = document.getElementById(
      "marketing-page-wrapper"
    );
    if (marketingPageWrapper?.scrollTop! > threshold) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  }, [threshold]);

  useEffect(() => {
    const marketingPageWrapper = document.getElementById(
      "marketing-page-wrapper"
    );

    marketingPageWrapper?.addEventListener("scroll", handleScroll);
    return () =>
      marketingPageWrapper?.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return scrolled;
};

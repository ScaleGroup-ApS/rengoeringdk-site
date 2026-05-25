/**
 * WpContent — renders WordPress block HTML from the WP-REST API.
 *
 * Uses dangerouslySetInnerHTML because WordPress content.rendered is
 * pre-rendered HTML from Gutenberg blocks. The .wp-content CSS class
 * in app.css provides styling for all standard block types.
 */

interface WpContentProps {
  html: string;
  className?: string;
}

export function WpContent({ html, className = "" }: WpContentProps) {
  return (
    <div
      className={`wp-content ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/**
 * Skeleton loader for WP content (used while fetching).
 */
export function WpContentSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 space-y-6 animate-fade-in-up">
      {/* Title skeleton */}
      <div className="skeleton h-12 w-3/4 mb-8" />
      {/* Paragraph skeletons */}
      <div className="skeleton h-4 w-full" />
      <div className="skeleton h-4 w-5/6" />
      <div className="skeleton h-4 w-4/5" />
      <div className="skeleton h-4 w-full" />
      {/* Image skeleton */}
      <div className="skeleton h-64 w-full my-8" />
      {/* More paragraph skeletons */}
      <div className="skeleton h-4 w-full" />
      <div className="skeleton h-4 w-3/4" />
      <div className="skeleton h-4 w-5/6" />
    </div>
  );
}

import { Boundary } from '#/ui/boundary';

export default function Byline() {
  return (
    <Boundary kind="solid" animateRerendering={false}>
      <div className="flex items-center gap-4 text-sm font-medium text-gray-600">
        {/* image removed as requested */}
        <span className="whitespace-pre-line">Transcend the hype with MERCURY by Ratio Machina</span>
      </div>
    </Boundary>
  );
}

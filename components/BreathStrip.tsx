export default function BreathStrip() {
  return (
    <section className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 min-h-[320px]">
        {/* Panel 1 */}
        <div className="p-12 relative border-r flex flex-col" style={{ backgroundColor: '#90AB8B', borderColor: 'rgba(90, 120, 99, 0.25)' }}>
            <div className="flex justify-between items-start mb-auto">
              <svg className="w-12 h-12" style={{ color: 'rgba(255, 255, 255, 0.7)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-xs font-light tracking-wide" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>01.</span>
            </div>
            <div className="mt-auto">
              <h3 className="font-medium text-white mb-3" style={{ fontSize: '28px' }}>
                True Ownership
              </h3>
              <p className="leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px' }}>
                Your work stays yours. DraftLock stores documentation, not rights.
              </p>
            </div>
          </div>

          {/* Panel 2 */}
          <div className="p-12 relative border-r flex flex-col" style={{ backgroundColor: '#3B4953', borderColor: 'rgba(90, 120, 99, 0.25)' }}>
            <div className="flex justify-between items-start mb-auto">
              <svg className="w-12 h-12" style={{ color: '#FFFFFF' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs font-light tracking-wide" style={{ color: '#FFFFFF' }}>02.</span>
            </div>
            <div className="mt-auto">
              <h3 className="font-medium text-white mb-3" style={{ fontSize: '28px' }}>
                On Your Terms
              </h3>
              <p className="leading-relaxed" style={{ color: '#FFFFFF', fontSize: '14px' }}>
                Create a one-time record for a specific moment, or subscribe to keep documentation active over time.
              </p>
            </div>
          </div>

        {/* Panel 3 */}
        <div className="p-12 relative flex flex-col" style={{ backgroundColor: '#E7E8E1' }}>
            <div className="flex justify-between items-start mb-auto">
              <svg className="w-12 h-12" style={{ color: 'rgba(14, 17, 22, 0.6)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-xs font-light tracking-wide" style={{ color: 'rgba(14, 17, 22, 0.6)' }}>03.</span>
            </div>
            <div className="mt-auto">
              <h3 className="font-medium" style={{ color: '#0E1116', fontSize: '28px' }}>Built to Last</h3>
              <p className="leading-relaxed" style={{ color: 'rgba(14, 17, 22, 0.8)', fontSize: '14px' }}>
                Neutral formatting designed for long-term storage, sharing, and reference.
              </p>
            </div>
          </div>
      </div>
    </section>
  );
}

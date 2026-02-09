const Section3 = () => {
  return (
    <section className="bg-[#FCF9FF] bg-[linear-gradient(to_right,rgba(106,6,228,0.18),transparent_20%,transparent_80%,rgba(106,6,228,0.18))] py-20">
      <div className="">
        <div className="text-box flex flex-col justify-center items-center gap-2 mb-16">
          <div className="flex gap-2">
            <span className="text-[#6A06E4] text-[40px] font-extrabold">
              How Dmbroo Automates
            </span>{" "}
            <span className="text-[40px] font-extrabold">
              {" "}
              Your Social Growth
            </span>
          </div>
          <p className="text-[20px] font-medium text-[#071329]">
            Convert interactions into followers, engagement, and real results.
          </p>
        </div>

        <TabChanger />
      </div>
    </section>
  );
};

const TabChanger = () => {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Step Tabs */}
      <div className="flex gap-4 mb-12">
        {["Step 1", "Step 2", "Step 3", "Step 4", "Step 5"].map(
          (step, index) => (
            <button
              key={index}
              className="px-8 py-4 text-[#6A06E4] text-xl font-semibold bg-transparent rounded-t-2xl"
            >
              {step}
            </button>
          ),
        )}
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-3xl p-12 shadow-lg border border-purple-200">
        <div className="grid grid-cols-2 gap-12">
          {/* Left: Text Content */}
          <div className="space-y-4">
            <h3 className="text-[32px] font-bold text-[#6A06E4]">
              Connect Your Account
            </h3>
            <p className="text-[18px] text-[#503176] leading-relaxed">
              Securely connect your Instagram Creator or Business account.
            </p>
          </div>

          {/* Right: Image Placeholder */}
          <div className="bg-gray-100 rounded-2xl h-64 flex items-center justify-center">
            <span className="text-gray-400 text-sm">Image Preview</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Section3;

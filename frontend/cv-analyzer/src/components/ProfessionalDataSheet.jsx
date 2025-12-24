import React from 'react';

const RowItem = ({ label, value, iconType }) => (
  <div className="flex items-center justify-between py-3 px-4 border border-slate-200 rounded-xl mb-2 bg-white hover:border-blue-200 transition-all">
    <div className="flex items-center gap-3">
      {/* أيقونة المربع الصغير على اليسار */}
      <div className="w-9 h-9 border border-slate-200 rounded-lg flex items-center justify-center text-slate-400 bg-slate-50">
        {iconType === 'text' ? <span className="text-xs font-bold">Aa</span> : 
         iconType === 'box' ? <div className="w-3 h-3 border-2 border-slate-300 rounded-sm"></div> : "📄"}
      </div>
      <span className="text-[14px] font-semibold text-slate-700">{label}</span>
    </div>
    
    <div className="flex items-center gap-4">
      <span className="text-[14px] text-slate-500">
        {Array.isArray(value) ? value.join(", ") : (value || "No information available")}
      </span>
      
      {/* أيقونات التحكم (تعديل، تبديل، ترتيب) */}
      <button className="p-1 text-slate-300 hover:text-blue-500"><span className="text-sm">✎</span></button>

      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" className="sr-only peer" defaultChecked={!!value} />
        <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:bg-blue-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4"></div>
      </label>

      <div className="flex flex-col gap-[2px]">
        <div className="w-3 h-[2px] bg-slate-200"></div>
        <div className="w-3 h-[2px] bg-slate-200"></div>
      </div>
    </div>
  </div>
);

const SectionHeader = ({ title }) => (
  <div className="flex justify-between items-center mb-4 mt-8 px-2">
    <h2 className="text-[15px] font-bold text-slate-800">{title}</h2>
    <div className="flex gap-3 items-center">
       <button className="text-blue-500 font-bold">+</button>
       <button className="text-slate-300">🗑</button>
       <div className="flex flex-col gap-[2px]">
          <div className="w-4 h-[2px] bg-slate-300"></div>
          <div className="w-4 h-[2px] bg-slate-300"></div>
       </div>
    </div>
  </div>
);

const ProfessionalDataSheet = ({ data }) => {
  if (!data) return null;

  return (
    <div className="p-6 bg-[#fcfdfe] max-w-4xl mx-auto rounded-2xl">
      
      {/* 1. Personal Information */}
      <SectionHeader title="Personal Information" />
      <RowItem label="Candidate Name" value={data.personal_info?.full_name} iconType="box" />
      <RowItem label="Date of Birth" value={data.personal_info?.dob} iconType="box" />
      <RowItem label="Nationality" value={data.personal_info?.nationality} iconType="text" />

      {/* 2. Contact and Location */}
      <SectionHeader title="Contact and Location" />
      <RowItem label="Email Address" value={data.contact_location?.email} iconType="text" />
      <RowItem label="Phone Number" value={data.contact_location?.phone} iconType="box" />
      <RowItem label="Website" value={data.contact_location?.website} iconType="text" />
      <RowItem label="Location" value={data.contact_location?.location} iconType="box" />
      <RowItem label="Availability" value={data.contact_location?.availability} iconType="box" />

      {/* 3. Objectives */}
      <SectionHeader title="Objectives" />
      <RowItem label="Objectives" value={data.objectives?.objective_text} iconType="text" />
      <RowItem label="Summary" value={data.objectives?.summary_text} iconType="text" />
      <RowItem label="Expected Salary" value={data.objectives?.expected_salary} iconType="box" />

      {/* 4. Education and Certifications */}
      <SectionHeader title="Education and Certifications" />
      <RowItem label="Degrees/Certs" value={data.education_certs} iconType="box" />

      {/* 5. Work Experience */}
      <SectionHeader title="Work Experience" />
      <RowItem label="Experience Details" value={data.work_experience} iconType="box" />

      {/* 6. Skills & Language */}
      <SectionHeader title="Skills" />
      <RowItem label="Skills List" value={data.skills} iconType="box" />

      <SectionHeader title="Language" />
      <RowItem label="Languages" value={data.languages} iconType="text" />

    </div>
  );
};

export default ProfessionalDataSheet;
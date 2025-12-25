import React from 'react';

const RowItem = ({ label, value, iconType }) => (
  // التغيير الرئيسي هنا: flex-col للجوال و sm:flex-row للشاشات الكبيرة
  <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 px-3 sm:px-4 border border-slate-200 rounded-xl mb-2 bg-white hover:border-blue-200 transition-all shadow-sm sm:shadow-none">
    
    {/* القسم العلوي (أو الأيسر): الأيقونة والعنوان */}
    <div className="flex items-center gap-3 mb-2 sm:mb-0 w-full sm:w-auto">
      <div className="w-8 h-8 sm:w-9 sm:h-9 flex-shrink-0 border border-slate-200 rounded-lg flex items-center justify-center text-slate-400 bg-slate-50">
        {iconType === 'text' ? <span className="text-xs font-bold">Aa</span> : 
         iconType === 'box' ? <div className="w-3 h-3 border-2 border-slate-300 rounded-sm"></div> : "📄"}
      </div>
      <span className="text-[13px] sm:text-[14px] font-semibold text-slate-700 truncate">{label}</span>
    </div>
    
    {/* القسم السفلي (أو الأيمن): القيمة وأزرار التحكم */}
    {/* w-full يجعلها تمتد في الجوال، و sm:w-auto يجعلها تتقلص في الكمبيوتر */}
    <div className="flex items-start sm:items-center justify-between sm:justify-end gap-2 sm:gap-4 w-full sm:w-auto pl-11 sm:pl-0">
      
      {/* عرض القيمة: نص يلتف تلقائياً في الجوال */}
      <span className="text-[13px] sm:text-[14px] text-slate-500 break-words sm:text-right max-w-full sm:max-w-xs leading-relaxed">
        {Array.isArray(value) 
          ? (value.length > 0 ? value.join(", ") : "No information") 
          : (value || "No information available")}
      </span>
      
      {/* حاوية أزرار التحكم: ثابتة الحجم لا تتقلص */}
      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
        <button className="p-1 text-slate-300 hover:text-blue-500"><span className="text-sm">✎</span></button>

        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only peer" defaultChecked={!!value} />
          <div className="w-8 h-4 sm:w-9 sm:h-5 bg-slate-200 rounded-full peer peer-checked:bg-blue-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 sm:after:h-4 sm:after:w-4 after:transition-all peer-checked:after:translate-x-4"></div>
        </label>

        <div className="flex flex-col gap-[2px] cursor-grab p-1">
          <div className="w-3 h-[2px] bg-slate-200"></div>
          <div className="w-3 h-[2px] bg-slate-200"></div>
        </div>
      </div>

    </div>
  </div>
);

const SectionHeader = ({ title }) => (
  <div className="flex justify-between items-center mb-3 mt-6 sm:mt-8 px-1 sm:px-2">
    <h2 className="text-[14px] sm:text-[15px] font-bold text-slate-800">{title}</h2>
    <div className="flex gap-2 sm:gap-3 items-center">
       <button className="text-blue-500 font-bold p-1 hover:bg-blue-50 rounded">+</button>
       <button className="text-slate-300 p-1 hover:text-red-500 hover:bg-red-50 rounded">🗑</button>
       <div className="flex flex-col gap-[2px] p-1 cursor-pointer">
          <div className="w-4 h-[2px] bg-slate-300"></div>
          <div className="w-4 h-[2px] bg-slate-300"></div>
       </div>
    </div>
  </div>
);

const ProfessionalDataSheet = ({ data }) => {
  if (!data) return null;

  return (
    // تقليل البادينج في الجوال p-3 وزيادته في الكمبيوتر sm:p-6
    <div className="p-3 sm:p-6 bg-[#fcfdfe] w-full max-w-4xl mx-auto rounded-2xl sm:border sm:border-slate-100">
      
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
      <SectionHeader title="Education / Certs" />
      <RowItem label="Degrees" value={data.education_certs} iconType="box" />

      {/* 5. Work Experience */}
      <SectionHeader title="Work Experience" />
      <RowItem label="Experience" value={data.work_experience} iconType="box" />

      {/* 6. Skills & Language */}
      <SectionHeader title="Skills" />
      <RowItem label="Skills List" value={data.skills} iconType="box" />

      <SectionHeader title="Language" />
      <RowItem label="Languages" value={data.languages} iconType="text" />

    </div>
  );
};

export default ProfessionalDataSheet;
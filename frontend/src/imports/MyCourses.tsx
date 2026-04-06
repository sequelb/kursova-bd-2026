import svgPaths from "./svg-rw6xt3fsux";

function Container() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Segoe_UI_Emoji:Bold',sans-serif] leading-[28px] left-0 not-italic text-[#101828] text-[20px] top-[-2.5px] whitespace-nowrap">Teacher Portal</p>
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p1a1bc600} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.pd2076c0} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p35e1e580} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Layout() {
  return (
    <div className="h-[24px] relative shrink-0 w-[82.333px]" data-name="Layout">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] left-0 not-italic text-[16px] text-white top-[-1.5px] whitespace-nowrap">My Courses</p>
      </div>
    </div>
  );
}

function Link() {
  return (
    <div className="bg-[#101828] h-[52px] relative shrink-0 w-full" data-name="Link">
      <div aria-hidden="true" className="absolute border-2 border-[#1e2939] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center pl-[18px] pr-[2px] py-[2px] relative size-full">
          <Icon />
          <Layout />
        </div>
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p383b2000} id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Layout1() {
  return (
    <div className="h-[24px] relative shrink-0 w-[114.817px]" data-name="Layout">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#101828] text-[16px] top-[-1.5px] whitespace-nowrap">Student Reviews</p>
      </div>
    </div>
  );
}

function Link1() {
  return (
    <div className="bg-white h-[52px] relative shrink-0 w-full" data-name="Link">
      <div aria-hidden="true" className="absolute border-2 border-[#99a1af] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center pl-[18px] pr-[2px] py-[2px] relative size-full">
          <Icon1 />
          <Layout1 />
        </div>
      </div>
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d="M10 1.66667V18.3333" id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p3055a600} id="Vector_2" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Layout2() {
  return (
    <div className="h-[24px] relative shrink-0 w-[136.483px]" data-name="Layout">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#101828] text-[16px] top-[-1.5px] whitespace-nowrap">{`Earnings & Payouts`}</p>
      </div>
    </div>
  );
}

function Link2() {
  return (
    <div className="bg-white h-[52px] relative shrink-0 w-full" data-name="Link">
      <div aria-hidden="true" className="absolute border-2 border-[#99a1af] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center pl-[18px] pr-[2px] py-[2px] relative size-full">
          <Icon2 />
          <Layout2 />
        </div>
      </div>
    </div>
  );
}

function Navigation() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[172px] items-start relative shrink-0 w-full" data-name="Navigation">
      <Link />
      <Link1 />
      <Link2 />
    </div>
  );
}

function Sidebar() {
  return (
    <div className="bg-[#f3f4f6] h-[985px] relative shrink-0 w-[256px]" data-name="Sidebar">
      <div aria-hidden="true" className="absolute border-[#1e2939] border-r-2 border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[32px] items-start pl-[24px] pr-[26px] pt-[24px] relative size-full">
        <Container />
        <Navigation />
      </div>
    </div>
  );
}

function TextInput() {
  return (
    <div className="absolute bg-white h-[44px] left-0 top-0 w-[1288px]" data-name="Text Input">
      <div className="content-stretch flex items-center overflow-clip pl-[40px] pr-[16px] py-[8px] relative rounded-[inherit] size-full">
        <p className="font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-[rgba(10,10,10,0.5)] whitespace-nowrap">Search courses...</p>
      </div>
      <div aria-hidden="true" className="absolute border-2 border-[#1e2939] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Icon3() {
  return (
    <div className="absolute left-[12px] size-[20px] top-[12px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.pcddfd00} id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M17.5 17.5L13.9167 13.9167" id="Vector_2" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute h-[44px] left-0 top-0 w-[1288px]" data-name="Container">
      <TextInput />
      <Icon3 />
    </div>
  );
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d={svgPaths.p67f12c8} id="Vector" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p2c19cb00} id="Vector_2" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="absolute bg-[#d1d5dc] content-stretch flex items-center justify-center left-[1304px] p-[2px] size-[40px] top-[2px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-2 border-[#1e2939] border-solid inset-0 pointer-events-none" />
      <Icon4 />
    </div>
  );
}

function Container2() {
  return (
    <div className="h-[44px] relative shrink-0 w-full" data-name="Container">
      <Container3 />
      <Button />
    </div>
  );
}

function Header() {
  return (
    <div className="bg-[#f3f4f6] h-[78px] relative shrink-0 w-[1376px]" data-name="Header">
      <div aria-hidden="true" className="absolute border-[#1e2939] border-b-2 border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[2px] pt-[16px] px-[16px] relative size-full">
        <Container2 />
      </div>
    </div>
  );
}

function Heading() {
  return (
    <div className="h-[32px] relative shrink-0 w-[228.25px]" data-name="Heading 1">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Segoe_UI_Emoji:Bold',sans-serif] leading-[32px] not-italic relative shrink-0 text-[#101828] text-[24px] whitespace-nowrap">Manage My Courses</p>
      </div>
    </div>
  );
}

function Link3() {
  return (
    <div className="bg-[#101828] h-[52px] relative shrink-0 w-[187.467px]" data-name="Link">
      <div aria-hidden="true" className="absolute border-2 border-[#1e2939] border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] left-[26px] not-italic text-[16px] text-white top-[12.5px] whitespace-nowrap">Create New Course</p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="h-[52px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between relative size-full">
          <Heading />
          <Link3 />
        </div>
      </div>
    </div>
  );
}

function Text() {
  return (
    <div className="h-[20px] relative shrink-0 w-[93.65px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#6a7282] text-[14px] top-[-1.5px] whitespace-nowrap">[Course Image]</p>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="bg-[#e5e7eb] h-[160px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#1e2939] border-b-2 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pb-[2px] pr-[0.017px] relative size-full">
          <Text />
        </div>
      </div>
    </div>
  );
}

function Heading1() {
  return (
    <div className="absolute h-[27px] left-[16px] top-[16px] w-[274px]" data-name="Heading 3">
      <p className="absolute font-['Segoe_UI_Emoji:Bold',sans-serif] leading-[27px] left-0 not-italic text-[#101828] text-[18px] top-[-1.5px] whitespace-nowrap">Advanced JavaScript Concepts</p>
    </div>
  );
}

function Container10() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#364153] text-[14px] top-[-1.5px] whitespace-nowrap">Enrolled Students: 120</p>
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[20px] relative shrink-0 w-[96.967px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#364153] text-[14px] top-[-1.5px] whitespace-nowrap">Average Rating:</p>
      </div>
    </div>
  );
}

function Icon5() {
  return (
    <div className="absolute left-0 size-[16px] top-[2px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p17f48400} fill="var(--fill-0, #101828)" id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Icon6() {
  return (
    <div className="absolute left-[20px] size-[16px] top-[2px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p17f48400} fill="var(--fill-0, #101828)" id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Icon7() {
  return (
    <div className="absolute left-[40px] size-[16px] top-[2px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p17f48400} fill="var(--fill-0, #101828)" id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Icon8() {
  return (
    <div className="absolute left-[60px] size-[16px] top-[2px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p17f48400} fill="var(--fill-0, #101828)" id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Icon9() {
  return (
    <div className="absolute left-[80px] size-[16px] top-[2px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p17f48400} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text2() {
  return (
    <div className="absolute h-[20px] left-[104px] top-0 w-[19.9px]" data-name="Text">
      <p className="absolute font-['Segoe_UI_Emoji:Bold',sans-serif] leading-[20px] left-0 not-italic text-[#101828] text-[14px] top-[-1.5px] whitespace-nowrap">4.8</p>
    </div>
  );
}

function Container12() {
  return (
    <div className="h-[20px] relative shrink-0 w-[123.9px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon5 />
        <Icon6 />
        <Icon7 />
        <Icon8 />
        <Icon9 />
        <Text2 />
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex gap-[8px] h-[20px] items-center relative shrink-0 w-full" data-name="Container">
      <Text1 />
      <Container12 />
    </div>
  );
}

function Container9() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[48px] items-start left-[16px] top-[55px] w-[274px]" data-name="Container">
      <Container10 />
      <Container11 />
    </div>
  );
}

function Link4() {
  return (
    <div className="absolute bg-white border-2 border-[#1e2939] border-solid h-[44px] left-[16px] top-[119px] w-[274px]" data-name="Link">
      <p className="-translate-x-1/2 absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] left-[134.87px] not-italic text-[#101828] text-[16px] text-center top-[6.5px] whitespace-nowrap">Edit Course</p>
    </div>
  );
}

function Container8() {
  return (
    <div className="h-[179px] relative shrink-0 w-full" data-name="Container">
      <Heading1 />
      <Container9 />
      <Link4 />
    </div>
  );
}

function Container6() {
  return (
    <div className="bg-white col-1 justify-self-stretch relative row-1 self-stretch shrink-0" data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-[#1e2939] border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col items-start p-[2px] relative size-full">
        <Container7 />
        <Container8 />
      </div>
    </div>
  );
}

function Text3() {
  return (
    <div className="h-[20px] relative shrink-0 w-[93.65px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#6a7282] text-[14px] top-[-1.5px] whitespace-nowrap">[Course Image]</p>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="bg-[#e5e7eb] h-[160px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#1e2939] border-b-2 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pb-[2px] pr-[0.017px] relative size-full">
          <Text3 />
        </div>
      </div>
    </div>
  );
}

function Heading2() {
  return (
    <div className="absolute h-[27px] left-[16px] top-[16px] w-[274px]" data-name="Heading 3">
      <p className="absolute font-['Segoe_UI_Emoji:Bold',sans-serif] leading-[27px] left-0 not-italic text-[#101828] text-[18px] top-[-1.5px] whitespace-nowrap">React for Beginners</p>
    </div>
  );
}

function Container17() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#364153] text-[14px] top-[-1.5px] whitespace-nowrap">Enrolled Students: 85</p>
    </div>
  );
}

function Text4() {
  return (
    <div className="h-[20px] relative shrink-0 w-[96.967px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#364153] text-[14px] top-[-1.5px] whitespace-nowrap">Average Rating:</p>
      </div>
    </div>
  );
}

function Icon10() {
  return (
    <div className="absolute left-0 size-[16px] top-[2px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p17f48400} fill="var(--fill-0, #101828)" id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Icon11() {
  return (
    <div className="absolute left-[20px] size-[16px] top-[2px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p17f48400} fill="var(--fill-0, #101828)" id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Icon12() {
  return (
    <div className="absolute left-[40px] size-[16px] top-[2px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p17f48400} fill="var(--fill-0, #101828)" id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Icon13() {
  return (
    <div className="absolute left-[60px] size-[16px] top-[2px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p17f48400} fill="var(--fill-0, #101828)" id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Icon14() {
  return (
    <div className="absolute left-[80px] size-[16px] top-[2px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p17f48400} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text5() {
  return (
    <div className="absolute h-[20px] left-[104px] top-0 w-[19.9px]" data-name="Text">
      <p className="absolute font-['Segoe_UI_Emoji:Bold',sans-serif] leading-[20px] left-0 not-italic text-[#101828] text-[14px] top-[-1.5px] whitespace-nowrap">4.6</p>
    </div>
  );
}

function Container19() {
  return (
    <div className="h-[20px] relative shrink-0 w-[123.9px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon10 />
        <Icon11 />
        <Icon12 />
        <Icon13 />
        <Icon14 />
        <Text5 />
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="content-stretch flex gap-[8px] h-[20px] items-center relative shrink-0 w-full" data-name="Container">
      <Text4 />
      <Container19 />
    </div>
  );
}

function Container16() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[48px] items-start left-[16px] top-[55px] w-[274px]" data-name="Container">
      <Container17 />
      <Container18 />
    </div>
  );
}

function Link5() {
  return (
    <div className="absolute bg-white border-2 border-[#1e2939] border-solid h-[44px] left-[16px] top-[119px] w-[274px]" data-name="Link">
      <p className="-translate-x-1/2 absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] left-[134.87px] not-italic text-[#101828] text-[16px] text-center top-[6.5px] whitespace-nowrap">Edit Course</p>
    </div>
  );
}

function Container15() {
  return (
    <div className="h-[179px] relative shrink-0 w-full" data-name="Container">
      <Heading2 />
      <Container16 />
      <Link5 />
    </div>
  );
}

function Container13() {
  return (
    <div className="bg-white col-2 justify-self-stretch relative row-1 self-stretch shrink-0" data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-[#1e2939] border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col items-start p-[2px] relative size-full">
        <Container14 />
        <Container15 />
      </div>
    </div>
  );
}

function Text6() {
  return (
    <div className="h-[20px] relative shrink-0 w-[93.65px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#6a7282] text-[14px] top-[-1.5px] whitespace-nowrap">[Course Image]</p>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="bg-[#e5e7eb] h-[160px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#1e2939] border-b-2 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pb-[2px] pr-[0.017px] relative size-full">
          <Text6 />
        </div>
      </div>
    </div>
  );
}

function Heading3() {
  return (
    <div className="absolute h-[27px] left-[16px] top-[16px] w-[274px]" data-name="Heading 3">
      <p className="absolute font-['Segoe_UI_Emoji:Bold',sans-serif] leading-[27px] left-0 not-italic text-[#101828] text-[18px] top-[-1.5px] whitespace-nowrap">Python Programming Basics</p>
    </div>
  );
}

function Container24() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#364153] text-[14px] top-[-1.5px] whitespace-nowrap">Enrolled Students: 200</p>
    </div>
  );
}

function Text7() {
  return (
    <div className="h-[20px] relative shrink-0 w-[96.967px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#364153] text-[14px] top-[-1.5px] whitespace-nowrap">Average Rating:</p>
      </div>
    </div>
  );
}

function Icon15() {
  return (
    <div className="absolute left-0 size-[16px] top-[2px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p17f48400} fill="var(--fill-0, #101828)" id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Icon16() {
  return (
    <div className="absolute left-[20px] size-[16px] top-[2px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p17f48400} fill="var(--fill-0, #101828)" id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Icon17() {
  return (
    <div className="absolute left-[40px] size-[16px] top-[2px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p17f48400} fill="var(--fill-0, #101828)" id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Icon18() {
  return (
    <div className="absolute left-[60px] size-[16px] top-[2px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p17f48400} fill="var(--fill-0, #101828)" id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Icon19() {
  return (
    <div className="absolute left-[80px] size-[16px] top-[2px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p17f48400} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text8() {
  return (
    <div className="absolute h-[20px] left-[104px] top-0 w-[19.9px]" data-name="Text">
      <p className="absolute font-['Segoe_UI_Emoji:Bold',sans-serif] leading-[20px] left-0 not-italic text-[#101828] text-[14px] top-[-1.5px] whitespace-nowrap">4.9</p>
    </div>
  );
}

function Container26() {
  return (
    <div className="h-[20px] relative shrink-0 w-[123.9px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon15 />
        <Icon16 />
        <Icon17 />
        <Icon18 />
        <Icon19 />
        <Text8 />
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div className="content-stretch flex gap-[8px] h-[20px] items-center relative shrink-0 w-full" data-name="Container">
      <Text7 />
      <Container26 />
    </div>
  );
}

function Container23() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[48px] items-start left-[16px] top-[55px] w-[274px]" data-name="Container">
      <Container24 />
      <Container25 />
    </div>
  );
}

function Link6() {
  return (
    <div className="absolute bg-white border-2 border-[#1e2939] border-solid h-[44px] left-[16px] top-[119px] w-[274px]" data-name="Link">
      <p className="-translate-x-1/2 absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] left-[134.87px] not-italic text-[#101828] text-[16px] text-center top-[6.5px] whitespace-nowrap">Edit Course</p>
    </div>
  );
}

function Container22() {
  return (
    <div className="h-[179px] relative shrink-0 w-full" data-name="Container">
      <Heading3 />
      <Container23 />
      <Link6 />
    </div>
  );
}

function Container20() {
  return (
    <div className="bg-white col-3 justify-self-stretch relative row-1 self-stretch shrink-0" data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-[#1e2939] border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col items-start p-[2px] relative size-full">
        <Container21 />
        <Container22 />
      </div>
    </div>
  );
}

function Text9() {
  return (
    <div className="h-[20px] relative shrink-0 w-[93.65px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#6a7282] text-[14px] top-[-1.5px] whitespace-nowrap">[Course Image]</p>
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="bg-[#e5e7eb] h-[160px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#1e2939] border-b-2 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pb-[2px] pr-[0.017px] relative size-full">
          <Text9 />
        </div>
      </div>
    </div>
  );
}

function Heading4() {
  return (
    <div className="absolute h-[27px] left-[16px] top-[16px] w-[274px]" data-name="Heading 3">
      <p className="absolute font-['Segoe_UI_Emoji:Bold',sans-serif] leading-[27px] left-0 not-italic text-[#101828] text-[18px] top-[-1.5px] whitespace-nowrap">UI/UX Design Fundamentals</p>
    </div>
  );
}

function Container31() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#364153] text-[14px] top-[-1.5px] whitespace-nowrap">Enrolled Students: 150</p>
    </div>
  );
}

function Text10() {
  return (
    <div className="h-[20px] relative shrink-0 w-[96.967px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#364153] text-[14px] top-[-1.5px] whitespace-nowrap">Average Rating:</p>
      </div>
    </div>
  );
}

function Icon20() {
  return (
    <div className="absolute left-0 size-[16px] top-[2px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p17f48400} fill="var(--fill-0, #101828)" id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Icon21() {
  return (
    <div className="absolute left-[20px] size-[16px] top-[2px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p17f48400} fill="var(--fill-0, #101828)" id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Icon22() {
  return (
    <div className="absolute left-[40px] size-[16px] top-[2px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p17f48400} fill="var(--fill-0, #101828)" id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Icon23() {
  return (
    <div className="absolute left-[60px] size-[16px] top-[2px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p17f48400} fill="var(--fill-0, #101828)" id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Icon24() {
  return (
    <div className="absolute left-[80px] size-[16px] top-[2px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p17f48400} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text11() {
  return (
    <div className="absolute h-[20px] left-[104px] top-0 w-[19.9px]" data-name="Text">
      <p className="absolute font-['Segoe_UI_Emoji:Bold',sans-serif] leading-[20px] left-0 not-italic text-[#101828] text-[14px] top-[-1.5px] whitespace-nowrap">4.7</p>
    </div>
  );
}

function Container33() {
  return (
    <div className="h-[20px] relative shrink-0 w-[123.9px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon20 />
        <Icon21 />
        <Icon22 />
        <Icon23 />
        <Icon24 />
        <Text11 />
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div className="content-stretch flex gap-[8px] h-[20px] items-center relative shrink-0 w-full" data-name="Container">
      <Text10 />
      <Container33 />
    </div>
  );
}

function Container30() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[48px] items-start left-[16px] top-[55px] w-[274px]" data-name="Container">
      <Container31 />
      <Container32 />
    </div>
  );
}

function Link7() {
  return (
    <div className="absolute bg-white border-2 border-[#1e2939] border-solid h-[44px] left-[16px] top-[119px] w-[274px]" data-name="Link">
      <p className="-translate-x-1/2 absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] left-[134.87px] not-italic text-[#101828] text-[16px] text-center top-[6.5px] whitespace-nowrap">Edit Course</p>
    </div>
  );
}

function Container29() {
  return (
    <div className="h-[179px] relative shrink-0 w-full" data-name="Container">
      <Heading4 />
      <Container30 />
      <Link7 />
    </div>
  );
}

function Container27() {
  return (
    <div className="bg-white col-4 justify-self-stretch relative row-1 self-stretch shrink-0" data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-[#1e2939] border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col items-start p-[2px] relative size-full">
        <Container28 />
        <Container29 />
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="gap-x-[24px] gap-y-[24px] grid grid-cols-[repeat(4,minmax(0,1fr))] grid-rows-[repeat(1,minmax(0,1fr))] h-[343px] relative shrink-0 w-full" data-name="Container">
      <Container6 />
      <Container13 />
      <Container20 />
      <Container27 />
    </div>
  );
}

function TeacherDashboard() {
  return (
    <div className="h-[491px] relative shrink-0 w-full" data-name="TeacherDashboard">
      <div className="content-stretch flex flex-col gap-[32px] items-start pt-[32px] px-[32px] relative size-full">
        <Container4 />
        <Container5 />
      </div>
    </div>
  );
}

function MainContent() {
  return (
    <div className="bg-[#f9fafb] flex-[1_0_0] min-h-px min-w-px relative w-[1376px]" data-name="Main Content">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <TeacherDashboard />
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="flex-[1_0_0] h-[985px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Header />
        <MainContent />
      </div>
    </div>
  );
}

export default function MyCourses() {
  return (
    <div className="bg-white content-stretch flex items-start relative size-full" data-name="My Courses">
      <Sidebar />
      <Container1 />
    </div>
  );
}
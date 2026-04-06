import svgPaths from "./svg-b0stosgx8a";

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
          <path d={svgPaths.p1a1bc600} id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.pd2076c0} id="Vector_2" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p35e1e580} id="Vector_3" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Layout() {
  return (
    <div className="h-[24px] relative shrink-0 w-[82.333px]" data-name="Layout">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#101828] text-[16px] top-[-1.5px] whitespace-nowrap">My Courses</p>
      </div>
    </div>
  );
}

function Link() {
  return (
    <div className="bg-white h-[52px] relative shrink-0 w-full" data-name="Link">
      <div aria-hidden="true" className="absolute border-2 border-[#99a1af] border-solid inset-0 pointer-events-none" />
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
    <div className="content-stretch flex h-[32px] items-start relative shrink-0 w-full" data-name="Heading 1">
      <p className="flex-[1_0_0] font-['Segoe_UI_Emoji:Bold',sans-serif] leading-[32px] min-h-px min-w-px not-italic relative text-[#101828] text-[24px]">{`Course & Lesson Editor`}</p>
    </div>
  );
}

function Label() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Label">
      <p className="absolute font-['Segoe_UI_Emoji:Bold',sans-serif] leading-[20px] left-0 not-italic text-[#101828] text-[14px] top-[-1.5px] whitespace-nowrap">Course Title</p>
    </div>
  );
}

function TextInput1() {
  return (
    <div className="bg-white h-[44px] relative shrink-0 w-full" data-name="Text Input">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center px-[16px] py-[8px] relative size-full">
          <p className="font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#0a0a0a] text-[16px] whitespace-nowrap">Advanced JavaScript Concepts</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-2 border-[#1e2939] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Container6() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[72px] items-start left-0 top-0 w-[896px]" data-name="Container">
      <Label />
      <TextInput1 />
    </div>
  );
}

function Label1() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Label">
      <p className="absolute font-['Segoe_UI_Emoji:Bold',sans-serif] leading-[20px] left-0 not-italic text-[#101828] text-[14px] top-[-1.5px] whitespace-nowrap">Category</p>
    </div>
  );
}

function Frame() {
  return (
    <div className="-translate-y-1/2 absolute h-[31px] left-[122px] overflow-clip top-1/2 w-[137px]">
      <div className="absolute bg-[#d7d8d9] inset-[0_5.11%_0_0]" />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[calc(50%-59.5px)] not-italic text-[14px] text-black top-[calc(50%-9.5px)] whitespace-nowrap">Programming</p>
      <div className="-translate-y-1/2 absolute left-[105px] overflow-clip size-[19px] top-1/2" data-name="X">
        <div className="absolute inset-1/4" data-name="Icon">
          <div className="absolute inset-[-10.53%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.5 11.5">
              <path d="M10.5 1L1 10.5M1 1L10.5 10.5" id="Icon" stroke="var(--stroke-0, #474747)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="-translate-y-1/2 absolute h-[31px] left-[7px] overflow-clip top-1/2 w-[104px]">
      <div className="-translate-y-1/2 absolute bg-[#d7d8d9] h-[31px] left-0 top-1/2 w-[104px]" />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[calc(50%-46px)] not-italic text-[14px] text-black top-[calc(50%-9.5px)] whitespace-nowrap">JavaScript</p>
      <div className="-translate-y-1/2 absolute left-[82px] overflow-clip size-[19px] top-1/2" data-name="X">
        <div className="absolute inset-1/4" data-name="Icon">
          <div className="absolute inset-[-10.53%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.5 11.5">
              <path d="M10.5 1L1 10.5M1 1L10.5 10.5" id="Icon" stroke="var(--stroke-0, #474747)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Dropdown() {
  return (
    <div className="bg-white h-[41px] relative shrink-0 w-full" data-name="Dropdown">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <Frame />
        <Frame1 />
      </div>
      <div aria-hidden="true" className="absolute border-2 border-[#1e2939] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Container7() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[69px] items-start left-0 top-[96px] w-[896px]" data-name="Container">
      <Label1 />
      <Dropdown />
    </div>
  );
}

function Label2() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Label">
      <p className="absolute font-['Segoe_UI_Emoji:Bold',sans-serif] leading-[20px] left-0 not-italic text-[#101828] text-[14px] top-[-1.5px] whitespace-nowrap">Course Description</p>
    </div>
  );
}

function TextArea() {
  return (
    <div className="bg-white h-[164px] relative shrink-0 w-full" data-name="Text Area">
      <div aria-hidden="true" className="absolute border-2 border-[#1e2939] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Container8() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[193.5px] items-start left-0 top-[189px] w-[896px]" data-name="Container">
      <Label2 />
      <TextArea />
    </div>
  );
}

function Heading1() {
  return (
    <div className="absolute h-[28px] left-0 top-0 w-[896px]" data-name="Heading 2">
      <p className="absolute font-['Segoe_UI_Emoji:Bold',sans-serif] leading-[28px] left-0 not-italic text-[#101828] text-[20px] top-[-2.5px] whitespace-nowrap">Curriculum</p>
    </div>
  );
}

function Text() {
  return (
    <div className="h-[24px] relative shrink-0 w-[319.4px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#101828] text-[16px] top-[-1.5px] whitespace-nowrap">Lesson 1: Introduction to Advanced Concepts</p>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="h-[20px] relative shrink-0 w-[23.467px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Segoe_UI_Emoji:Medium',sans-serif] leading-[20px] left-[12.5px] not-italic text-[#101828] text-[14px] text-center top-[-1.5px] whitespace-nowrap">Edit</p>
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="flex-[1_0_0] h-[20px] min-h-px min-w-px relative" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Segoe_UI_Emoji:Medium',sans-serif] leading-[20px] left-[20.5px] not-italic text-[#101828] text-[14px] text-center top-[-1.5px] whitespace-nowrap">Delete</p>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="h-[20px] relative shrink-0 w-[79.367px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center relative size-full">
        <Button1 />
        <Button2 />
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="h-[58px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#99a1af] border-b-2 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between pb-[2px] px-[16px] relative size-full">
          <Text />
          <Container11 />
        </div>
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[24px] relative shrink-0 w-[206.883px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#101828] text-[16px] top-[-1.5px] whitespace-nowrap">Lesson 2: Closures and Scope</p>
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div className="h-[20px] relative shrink-0 w-[23.467px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Segoe_UI_Emoji:Medium',sans-serif] leading-[20px] left-[12.5px] not-italic text-[#101828] text-[14px] text-center top-[-1.5px] whitespace-nowrap">Edit</p>
      </div>
    </div>
  );
}

function Button4() {
  return (
    <div className="flex-[1_0_0] h-[20px] min-h-px min-w-px relative" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Segoe_UI_Emoji:Medium',sans-serif] leading-[20px] left-[20.5px] not-italic text-[#101828] text-[14px] text-center top-[-1.5px] whitespace-nowrap">Delete</p>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="h-[20px] relative shrink-0 w-[79.367px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center relative size-full">
        <Button3 />
        <Button4 />
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="h-[58px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#99a1af] border-b-2 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between pb-[2px] px-[16px] relative size-full">
          <Text1 />
          <Container13 />
        </div>
      </div>
    </div>
  );
}

function Text2() {
  return (
    <div className="h-[24px] relative shrink-0 w-[254.167px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#101828] text-[16px] top-[-1.5px] whitespace-nowrap">Lesson 3: Async/Await and Promises</p>
      </div>
    </div>
  );
}

function Button5() {
  return (
    <div className="h-[20px] relative shrink-0 w-[23.467px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Segoe_UI_Emoji:Medium',sans-serif] leading-[20px] left-[12.5px] not-italic text-[#101828] text-[14px] text-center top-[-1.5px] whitespace-nowrap">Edit</p>
      </div>
    </div>
  );
}

function Button6() {
  return (
    <div className="flex-[1_0_0] h-[20px] min-h-px min-w-px relative" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Segoe_UI_Emoji:Medium',sans-serif] leading-[20px] left-[20.5px] not-italic text-[#101828] text-[14px] text-center top-[-1.5px] whitespace-nowrap">Delete</p>
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="h-[20px] relative shrink-0 w-[79.367px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center relative size-full">
        <Button5 />
        <Button6 />
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="h-[56px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[16px] relative size-full">
          <Text2 />
          <Container15 />
        </div>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[176px] items-start left-0 p-[2px] top-[44px] w-[896px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-[#1e2939] border-solid inset-0 pointer-events-none" />
      <Container10 />
      <Container12 />
      <Container14 />
    </div>
  );
}

function Button7() {
  return (
    <div className="absolute bg-white border-2 border-[#1e2939] border-solid h-[52px] left-0 top-[236px] w-[202.05px]" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Segoe_UI_Emoji:Medium',sans-serif] leading-[24px] left-[99.5px] not-italic text-[#101828] text-[16px] text-center top-[10.5px] whitespace-nowrap">Add New Text Lesson</p>
    </div>
  );
}

function Section() {
  return (
    <div className="absolute h-[288px] left-0 top-[414.5px] w-[896px]" data-name="Section">
      <Heading1 />
      <Container9 />
      <Button7 />
    </div>
  );
}

function Container5() {
  return (
    <div className="flex-[1_0_0] h-[702.5px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container6 />
        <Container7 />
        <Container8 />
        <Section />
      </div>
    </div>
  );
}

function Container16() {
  return <div className="flex-[1_0_0] h-[702.5px] min-h-px min-w-px" data-name="Container" />;
}

function Container4() {
  return (
    <div className="content-stretch flex gap-[32px] h-[702.5px] items-start relative shrink-0 w-full" data-name="Container">
      <Container5 />
      <Container16 />
    </div>
  );
}

function CourseEditor1() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[32px] h-[830.5px] items-start left-0 pt-[32px] px-[32px] top-0 w-[1376px]" data-name="CourseEditor">
      <Heading />
      <Container4 />
    </div>
  );
}

function Label3() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Label">
      <p className="absolute font-['Segoe_UI_Emoji:Bold',sans-serif] leading-[20px] left-0 not-italic text-[#101828] text-[14px] top-[-1.5px] whitespace-nowrap">Price ($)</p>
    </div>
  );
}

function NumberInput() {
  return (
    <div className="bg-white h-[44px] relative shrink-0 w-full" data-name="Number Input">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center px-[16px] py-[8px] relative size-full">
          <p className="font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#0a0a0a] text-[16px] whitespace-nowrap">79.99</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-2 border-[#1e2939] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Container17() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[72px] items-start relative shrink-0 w-full" data-name="Container">
      <Label3 />
      <NumberInput />
    </div>
  );
}

function Label4() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Label">
      <p className="absolute font-['Segoe_UI_Emoji:Bold',sans-serif] leading-[20px] left-0 not-italic text-[#101828] text-[14px] top-[-1.5px] whitespace-nowrap">Level</p>
    </div>
  );
}

function Option() {
  return <div className="absolute left-[-1242px] size-0 top-[-324px]" data-name="Option" />;
}

function Option1() {
  return <div className="absolute left-[-1242px] size-0 top-[-324px]" data-name="Option" />;
}

function Option2() {
  return <div className="absolute left-[-1242px] size-0 top-[-324px]" data-name="Option" />;
}

function Dropdown1() {
  return (
    <div className="bg-white h-[41px] relative shrink-0 w-full" data-name="Dropdown">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <Option />
        <Option1 />
        <Option2 />
      </div>
      <div aria-hidden="true" className="absolute border-2 border-[#1e2939] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Container18() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[69px] items-start relative shrink-0 w-full" data-name="Container">
      <Label4 />
      <Dropdown1 />
    </div>
  );
}

function Button8() {
  return (
    <div className="bg-[#101828] h-[64px] relative shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border-2 border-[#1e2939] border-solid inset-0 pointer-events-none" />
      <p className="-translate-x-1/2 absolute font-['Segoe_UI_Emoji:Bold',sans-serif] leading-[28px] left-[166.25px] not-italic text-[18px] text-center text-white top-[17px] whitespace-nowrap">Save Course Changes</p>
    </div>
  );
}

function CourseEditor2() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[24px] h-[305px] items-start left-[960px] pb-[2px] pt-[26px] px-[26px] top-[96px] w-[384px]" data-name="CourseEditor">
      <div aria-hidden="true" className="absolute border-2 border-[#1e2939] border-solid inset-0 pointer-events-none" />
      <Container17 />
      <Container18 />
      <Button8 />
    </div>
  );
}

function MainContent() {
  return (
    <div className="bg-[#f9fafb] flex-[1_0_0] min-h-px min-w-px relative w-[1376px]" data-name="Main Content">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <CourseEditor1 />
        <CourseEditor2 />
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

export default function CourseEditor() {
  return (
    <div className="bg-white content-stretch flex items-start relative size-full" data-name="Course Editor">
      <Sidebar />
      <Container1 />
    </div>
  );
}
import svgPaths from "./svg-zhauspum1g";

function Container() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Segoe_UI_Emoji:Bold',sans-serif] leading-[28px] left-0 not-italic text-[#101828] text-[20px] top-[-2.5px] whitespace-nowrap">Student Portal</p>
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.pd2ce200} id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M18.3333 8.33333V13.3333" id="Vector_2" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p1ead9c00} id="Vector_3" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Layout() {
  return (
    <div className="h-[24px] relative shrink-0 w-[87.5px]" data-name="Layout">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#101828] text-[16px] top-[-1.5px] whitespace-nowrap">My Learning</p>
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
          <path d="M10 5.83333V17.5" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p25713000} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Layout1() {
  return (
    <div className="h-[24px] relative shrink-0 w-[54.267px]" data-name="Layout">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] left-0 not-italic text-[16px] text-white top-[-1.5px] whitespace-nowrap">Catalog</p>
      </div>
    </div>
  );
}

function Link1() {
  return (
    <div className="bg-[#101828] h-[52px] relative shrink-0 w-full" data-name="Link">
      <div aria-hidden="true" className="absolute border-2 border-[#1e2939] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center pl-[18px] pr-[2px] py-[2px] relative size-full">
          <Icon1 />
          <Layout1 />
        </div>
      </div>
    </div>
  );
}

function Navigation() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[112px] items-start relative shrink-0 w-full" data-name="Navigation">
      <Link />
      <Link1 />
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

function Icon2() {
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

function Container3() {
  return (
    <div className="absolute bg-[#d1d5dc] content-stretch flex items-center justify-center left-[1304px] p-[2px] size-[40px] top-[2px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-[#1e2939] border-solid inset-0 pointer-events-none" />
      <Icon2 />
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

function Container4() {
  return (
    <div className="absolute h-[44px] left-0 top-0 w-[1288px]" data-name="Container">
      <TextInput />
      <Icon3 />
    </div>
  );
}

function Container2() {
  return (
    <div className="h-[44px] relative shrink-0 w-full" data-name="Container">
      <Container3 />
      <Container4 />
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

function Text() {
  return (
    <div className="h-[24px] relative shrink-0 w-[63.933px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Segoe_UI_Emoji:Medium',sans-serif] leading-[24px] left-[32.5px] not-italic text-[#0a0a0a] text-[16px] text-center top-[-1.5px] whitespace-nowrap">Category</p>
      </div>
    </div>
  );
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M4 6L8 10L12 6" id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="absolute bg-white content-stretch flex gap-[8px] h-[44px] items-center left-0 pl-[18px] pr-[2px] py-[2px] top-0 w-[123.933px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-2 border-[#1e2939] border-solid inset-0 pointer-events-none" />
      <Text />
      <Icon4 />
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[24px] relative shrink-0 w-[45.467px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Segoe_UI_Emoji:Medium',sans-serif] leading-[24px] left-[23.5px] not-italic text-[#0a0a0a] text-[16px] text-center top-[-1.5px] whitespace-nowrap">Rating</p>
      </div>
    </div>
  );
}

function Icon5() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M4 6L8 10L12 6" id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="absolute bg-white content-stretch flex gap-[8px] h-[44px] items-center left-[139.93px] pl-[18px] pr-[2px] py-[2px] top-0 w-[105.467px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-2 border-[#1e2939] border-solid inset-0 pointer-events-none" />
      <Text1 />
      <Icon5 />
    </div>
  );
}

function Text2() {
  return (
    <div className="h-[24px] relative shrink-0 w-[34.167px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Segoe_UI_Emoji:Medium',sans-serif] leading-[24px] left-[17.5px] not-italic text-[#0a0a0a] text-[16px] text-center top-[-1.5px] whitespace-nowrap">Price</p>
      </div>
    </div>
  );
}

function Icon6() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M4 6L8 10L12 6" id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div className="absolute bg-white content-stretch flex gap-[8px] h-[44px] items-center left-[261.4px] pl-[18px] pr-[2px] py-[2px] top-0 w-[94.167px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-2 border-[#1e2939] border-solid inset-0 pointer-events-none" />
      <Text2 />
      <Icon6 />
    </div>
  );
}

function Text3() {
  return (
    <div className="h-[24px] relative shrink-0 w-[53.867px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#364153] text-[16px] top-[-1.5px] whitespace-nowrap">Sort by:</p>
      </div>
    </div>
  );
}

function Text4() {
  return (
    <div className="h-[24px] relative shrink-0 w-[70.317px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Segoe_UI_Emoji:Medium',sans-serif] leading-[24px] left-[35px] not-italic text-[#0a0a0a] text-[16px] text-center top-[-1.5px] whitespace-nowrap">Relevance</p>
      </div>
    </div>
  );
}

function Icon7() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M4 6L8 10L12 6" id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button3() {
  return (
    <div className="bg-white h-[44px] relative shrink-0 w-[130.317px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-2 border-[#1e2939] border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center pl-[18px] pr-[2px] py-[2px] relative size-full">
        <Text4 />
        <Icon7 />
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[44px] items-center left-[1139.82px] top-0 w-[192.183px]" data-name="Container">
      <Text3 />
      <Button3 />
    </div>
  );
}

function Container6() {
  return (
    <div className="h-[44px] relative shrink-0 w-full" data-name="Container">
      <Button />
      <Button1 />
      <Button2 />
      <Container7 />
    </div>
  );
}

function Container5() {
  return (
    <div className="bg-[#f3f4f6] h-[78px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#1e2939] border-b-2 border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col items-start pb-[2px] pt-[16px] px-[16px] relative size-full">
        <Container6 />
      </div>
    </div>
  );
}

function Heading() {
  return (
    <div className="content-stretch flex h-[32px] items-start relative shrink-0 w-full" data-name="Heading 1">
      <p className="flex-[1_0_0] font-['Segoe_UI_Emoji:Bold',sans-serif] leading-[32px] min-h-px min-w-px not-italic relative text-[#101828] text-[24px]">Course Catalog</p>
    </div>
  );
}

function Text5() {
  return (
    <div className="h-[20px] relative shrink-0 w-[122.8px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#6a7282] text-[14px] top-[-1.5px] whitespace-nowrap">[Image Placeholder]</p>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="absolute bg-[#e5e7eb] content-stretch flex h-[160px] items-center justify-center left-[16px] p-[2px] top-[16px] w-[381.333px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-[#99a1af] border-solid inset-0 pointer-events-none" />
      <Text5 />
    </div>
  );
}

function Heading1() {
  return (
    <div className="absolute h-[27px] left-[16px] top-[192px] w-[381.333px]" data-name="Heading 3">
      <p className="absolute font-['Segoe_UI_Emoji:Bold',sans-serif] leading-[27px] left-0 not-italic text-[#101828] text-[18px] top-[-1.5px] whitespace-nowrap">Introduction to Web Development</p>
    </div>
  );
}

function Icon8() {
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

function Icon9() {
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

function Icon10() {
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

function Icon11() {
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

function Icon12() {
  return (
    <div className="absolute left-[80px] size-[16px] top-[2px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p17f48400} fill="var(--fill-0, #99A1AF)" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text6() {
  return (
    <div className="absolute h-[20px] left-[104px] top-0 w-[15.983px]" data-name="Text">
      <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[-1.5px] whitespace-nowrap">(4)</p>
    </div>
  );
}

function Container12() {
  return (
    <div className="absolute h-[20px] left-[16px] top-[227px] w-[381.333px]" data-name="Container">
      <Icon8 />
      <Icon9 />
      <Icon10 />
      <Icon11 />
      <Icon12 />
      <Text6 />
    </div>
  );
}

function Paragraph() {
  return (
    <div className="absolute h-[24px] left-[16px] top-[255px] w-[381.333px]" data-name="Paragraph">
      <p className="absolute font-['Segoe_UI_Emoji:Bold',sans-serif] leading-[24px] left-0 not-italic text-[#101828] text-[16px] top-[-1.5px] whitespace-nowrap">$49.99</p>
    </div>
  );
}

function Link2() {
  return (
    <div className="absolute bg-[#101828] border-2 border-[#1e2939] border-solid h-[44px] left-[16px] top-[295px] w-[381.333px]" data-name="Link">
      <p className="-translate-x-1/2 absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] left-[189.32px] not-italic text-[16px] text-center text-white top-[6.5px] whitespace-nowrap">Details</p>
    </div>
  );
}

function Container10() {
  return (
    <div className="absolute bg-white border-2 border-[#1e2939] border-solid h-[359px] left-0 top-0 w-[417.333px]" data-name="Container">
      <Container11 />
      <Heading1 />
      <Container12 />
      <Paragraph />
      <Link2 />
    </div>
  );
}

function Text7() {
  return (
    <div className="h-[20px] relative shrink-0 w-[122.8px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#6a7282] text-[14px] top-[-1.5px] whitespace-nowrap">[Image Placeholder]</p>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="absolute bg-[#e5e7eb] content-stretch flex h-[160px] items-center justify-center left-[16px] p-[2px] top-[16px] w-[381.333px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-[#99a1af] border-solid inset-0 pointer-events-none" />
      <Text7 />
    </div>
  );
}

function Heading2() {
  return (
    <div className="absolute h-[27px] left-[16px] top-[192px] w-[381.333px]" data-name="Heading 3">
      <p className="absolute font-['Segoe_UI_Emoji:Bold',sans-serif] leading-[27px] left-0 not-italic text-[#101828] text-[18px] top-[-1.5px] whitespace-nowrap">Advanced JavaScript Concepts</p>
    </div>
  );
}

function Icon13() {
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

function Icon14() {
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

function Icon15() {
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

function Icon16() {
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

function Icon17() {
  return (
    <div className="absolute left-[80px] size-[16px] top-[2px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p17f48400} fill="var(--fill-0, #101828)" id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text8() {
  return (
    <div className="absolute h-[20px] left-[104px] top-0 w-[15.983px]" data-name="Text">
      <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[-1.5px] whitespace-nowrap">(5)</p>
    </div>
  );
}

function Container15() {
  return (
    <div className="absolute h-[20px] left-[16px] top-[227px] w-[381.333px]" data-name="Container">
      <Icon13 />
      <Icon14 />
      <Icon15 />
      <Icon16 />
      <Icon17 />
      <Text8 />
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="absolute h-[24px] left-[16px] top-[255px] w-[381.333px]" data-name="Paragraph">
      <p className="absolute font-['Segoe_UI_Emoji:Bold',sans-serif] leading-[24px] left-0 not-italic text-[#101828] text-[16px] top-[-1.5px] whitespace-nowrap">$79.99</p>
    </div>
  );
}

function Link3() {
  return (
    <div className="absolute bg-[#101828] border-2 border-[#1e2939] border-solid h-[44px] left-[16px] top-[295px] w-[381.333px]" data-name="Link">
      <p className="-translate-x-1/2 absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] left-[189.32px] not-italic text-[16px] text-center text-white top-[6.5px] whitespace-nowrap">Details</p>
    </div>
  );
}

function Container13() {
  return (
    <div className="absolute bg-white border-2 border-[#1e2939] border-solid h-[359px] left-[441.33px] top-0 w-[417.333px]" data-name="Container">
      <Container14 />
      <Heading2 />
      <Container15 />
      <Paragraph1 />
      <Link3 />
    </div>
  );
}

function Text9() {
  return (
    <div className="h-[20px] relative shrink-0 w-[122.8px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#6a7282] text-[14px] top-[-1.5px] whitespace-nowrap">[Image Placeholder]</p>
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="absolute bg-[#e5e7eb] content-stretch flex h-[160px] items-center justify-center left-[16px] p-[2px] top-[16px] w-[381.333px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-[#99a1af] border-solid inset-0 pointer-events-none" />
      <Text9 />
    </div>
  );
}

function Heading3() {
  return (
    <div className="absolute h-[27px] left-[16px] top-[192px] w-[381.333px]" data-name="Heading 3">
      <p className="absolute font-['Segoe_UI_Emoji:Bold',sans-serif] leading-[27px] left-0 not-italic text-[#101828] text-[18px] top-[-1.5px] whitespace-nowrap">UI/UX Design Fundamentals</p>
    </div>
  );
}

function Icon18() {
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

function Icon19() {
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

function Icon20() {
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

function Icon21() {
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

function Icon22() {
  return (
    <div className="absolute left-[80px] size-[16px] top-[2px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p17f48400} fill="var(--fill-0, #99A1AF)" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text10() {
  return (
    <div className="absolute h-[20px] left-[104px] top-0 w-[26.567px]" data-name="Text">
      <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[-1.5px] whitespace-nowrap">(4.5)</p>
    </div>
  );
}

function Container18() {
  return (
    <div className="absolute h-[20px] left-[16px] top-[227px] w-[381.333px]" data-name="Container">
      <Icon18 />
      <Icon19 />
      <Icon20 />
      <Icon21 />
      <Icon22 />
      <Text10 />
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="absolute h-[24px] left-[16px] top-[255px] w-[381.333px]" data-name="Paragraph">
      <p className="absolute font-['Segoe_UI_Emoji:Bold',sans-serif] leading-[24px] left-0 not-italic text-[#101828] text-[16px] top-[-1.5px] whitespace-nowrap">$59.99</p>
    </div>
  );
}

function Link4() {
  return (
    <div className="absolute bg-[#101828] border-2 border-[#1e2939] border-solid h-[44px] left-[16px] top-[295px] w-[381.333px]" data-name="Link">
      <p className="-translate-x-1/2 absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] left-[189.32px] not-italic text-[16px] text-center text-white top-[6.5px] whitespace-nowrap">Details</p>
    </div>
  );
}

function Container16() {
  return (
    <div className="absolute bg-white border-2 border-[#1e2939] border-solid h-[359px] left-[882.67px] top-0 w-[417.333px]" data-name="Container">
      <Container17 />
      <Heading3 />
      <Container18 />
      <Paragraph2 />
      <Link4 />
    </div>
  );
}

function Text11() {
  return (
    <div className="h-[20px] relative shrink-0 w-[122.8px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#6a7282] text-[14px] top-[-1.5px] whitespace-nowrap">[Image Placeholder]</p>
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="absolute bg-[#e5e7eb] content-stretch flex h-[160px] items-center justify-center left-[16px] p-[2px] top-[16px] w-[381.333px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-[#99a1af] border-solid inset-0 pointer-events-none" />
      <Text11 />
    </div>
  );
}

function Heading4() {
  return (
    <div className="absolute h-[27px] left-[16px] top-[192px] w-[381.333px]" data-name="Heading 3">
      <p className="absolute font-['Segoe_UI_Emoji:Bold',sans-serif] leading-[27px] left-0 not-italic text-[#101828] text-[18px] top-[-1.5px] whitespace-nowrap">Python for Data Science</p>
    </div>
  );
}

function Icon23() {
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

function Icon24() {
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

function Icon25() {
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

function Icon26() {
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

function Icon27() {
  return (
    <div className="absolute left-[80px] size-[16px] top-[2px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p17f48400} fill="var(--fill-0, #99A1AF)" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text12() {
  return (
    <div className="absolute h-[20px] left-[104px] top-0 w-[26.567px]" data-name="Text">
      <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[-1.5px] whitespace-nowrap">(4.2)</p>
    </div>
  );
}

function Container21() {
  return (
    <div className="absolute h-[20px] left-[16px] top-[227px] w-[381.333px]" data-name="Container">
      <Icon23 />
      <Icon24 />
      <Icon25 />
      <Icon26 />
      <Icon27 />
      <Text12 />
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="absolute h-[24px] left-[16px] top-[255px] w-[381.333px]" data-name="Paragraph">
      <p className="absolute font-['Segoe_UI_Emoji:Bold',sans-serif] leading-[24px] left-0 not-italic text-[#101828] text-[16px] top-[-1.5px] whitespace-nowrap">$89.99</p>
    </div>
  );
}

function Link5() {
  return (
    <div className="absolute bg-[#101828] border-2 border-[#1e2939] border-solid h-[44px] left-[16px] top-[295px] w-[381.333px]" data-name="Link">
      <p className="-translate-x-1/2 absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] left-[189.32px] not-italic text-[16px] text-center text-white top-[6.5px] whitespace-nowrap">Details</p>
    </div>
  );
}

function Container19() {
  return (
    <div className="absolute bg-white border-2 border-[#1e2939] border-solid h-[359px] left-0 top-[383px] w-[417.333px]" data-name="Container">
      <Container20 />
      <Heading4 />
      <Container21 />
      <Paragraph3 />
      <Link5 />
    </div>
  );
}

function Text13() {
  return (
    <div className="h-[20px] relative shrink-0 w-[122.8px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#6a7282] text-[14px] top-[-1.5px] whitespace-nowrap">[Image Placeholder]</p>
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div className="absolute bg-[#e5e7eb] content-stretch flex h-[160px] items-center justify-center left-[16px] p-[2px] top-[16px] w-[381.333px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-[#99a1af] border-solid inset-0 pointer-events-none" />
      <Text13 />
    </div>
  );
}

function Heading5() {
  return (
    <div className="absolute h-[27px] left-[16px] top-[192px] w-[381.333px]" data-name="Heading 3">
      <p className="absolute font-['Segoe_UI_Emoji:Bold',sans-serif] leading-[27px] left-0 not-italic text-[#101828] text-[18px] top-[-1.5px] whitespace-nowrap">Mobile App Development</p>
    </div>
  );
}

function Icon28() {
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

function Icon29() {
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

function Icon30() {
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

function Icon31() {
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

function Icon32() {
  return (
    <div className="absolute left-[80px] size-[16px] top-[2px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p17f48400} fill="var(--fill-0, #99A1AF)" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text14() {
  return (
    <div className="absolute h-[20px] left-[104px] top-0 w-[26.567px]" data-name="Text">
      <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[-1.5px] whitespace-nowrap">(4.8)</p>
    </div>
  );
}

function Container24() {
  return (
    <div className="absolute h-[20px] left-[16px] top-[227px] w-[381.333px]" data-name="Container">
      <Icon28 />
      <Icon29 />
      <Icon30 />
      <Icon31 />
      <Icon32 />
      <Text14 />
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="absolute h-[24px] left-[16px] top-[255px] w-[381.333px]" data-name="Paragraph">
      <p className="absolute font-['Segoe_UI_Emoji:Bold',sans-serif] leading-[24px] left-0 not-italic text-[#101828] text-[16px] top-[-1.5px] whitespace-nowrap">$69.99</p>
    </div>
  );
}

function Link6() {
  return (
    <div className="absolute bg-[#101828] border-2 border-[#1e2939] border-solid h-[44px] left-[16px] top-[295px] w-[381.333px]" data-name="Link">
      <p className="-translate-x-1/2 absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] left-[189.32px] not-italic text-[16px] text-center text-white top-[6.5px] whitespace-nowrap">Details</p>
    </div>
  );
}

function Container22() {
  return (
    <div className="absolute bg-white border-2 border-[#1e2939] border-solid h-[359px] left-[441.33px] top-[383px] w-[417.333px]" data-name="Container">
      <Container23 />
      <Heading5 />
      <Container24 />
      <Paragraph4 />
      <Link6 />
    </div>
  );
}

function Text15() {
  return (
    <div className="h-[20px] relative shrink-0 w-[122.8px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#6a7282] text-[14px] top-[-1.5px] whitespace-nowrap">[Image Placeholder]</p>
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="absolute bg-[#e5e7eb] content-stretch flex h-[160px] items-center justify-center left-[16px] p-[2px] top-[16px] w-[381.333px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-[#99a1af] border-solid inset-0 pointer-events-none" />
      <Text15 />
    </div>
  );
}

function Heading6() {
  return (
    <div className="absolute h-[27px] left-[16px] top-[192px] w-[381.333px]" data-name="Heading 3">
      <p className="absolute font-['Segoe_UI_Emoji:Bold',sans-serif] leading-[27px] left-0 not-italic text-[#101828] text-[18px] top-[-1.5px] whitespace-nowrap">Database Management Systems</p>
    </div>
  );
}

function Icon33() {
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

function Icon34() {
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

function Icon35() {
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

function Icon36() {
  return (
    <div className="absolute left-[60px] size-[16px] top-[2px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p17f48400} fill="var(--fill-0, #99A1AF)" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Icon37() {
  return (
    <div className="absolute left-[80px] size-[16px] top-[2px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p17f48400} fill="var(--fill-0, #99A1AF)" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text16() {
  return (
    <div className="absolute h-[20px] left-[104px] top-0 w-[26.567px]" data-name="Text">
      <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[-1.5px] whitespace-nowrap">(3.5)</p>
    </div>
  );
}

function Container27() {
  return (
    <div className="absolute h-[20px] left-[16px] top-[227px] w-[381.333px]" data-name="Container">
      <Icon33 />
      <Icon34 />
      <Icon35 />
      <Icon36 />
      <Icon37 />
      <Text16 />
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="absolute h-[24px] left-[16px] top-[255px] w-[381.333px]" data-name="Paragraph">
      <p className="absolute font-['Segoe_UI_Emoji:Bold',sans-serif] leading-[24px] left-0 not-italic text-[#101828] text-[16px] top-[-1.5px] whitespace-nowrap">$54.99</p>
    </div>
  );
}

function Link7() {
  return (
    <div className="absolute bg-[#101828] border-2 border-[#1e2939] border-solid h-[44px] left-[16px] top-[295px] w-[381.333px]" data-name="Link">
      <p className="-translate-x-1/2 absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] left-[189.32px] not-italic text-[16px] text-center text-white top-[6.5px] whitespace-nowrap">Details</p>
    </div>
  );
}

function Container25() {
  return (
    <div className="absolute bg-white border-2 border-[#1e2939] border-solid h-[359px] left-[882.67px] top-[383px] w-[417.333px]" data-name="Container">
      <Container26 />
      <Heading6 />
      <Container27 />
      <Paragraph5 />
      <Link7 />
    </div>
  );
}

function Container9() {
  return (
    <div className="h-[742px] relative shrink-0 w-full" data-name="Container">
      <Container10 />
      <Container13 />
      <Container16 />
      <Container19 />
      <Container22 />
      <Container25 />
    </div>
  );
}

function Container8() {
  return (
    <div className="h-[862px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[24px] items-start pt-[32px] px-[32px] relative size-full">
        <Heading />
        <Container9 />
      </div>
    </div>
  );
}

function Catalog1() {
  return (
    <div className="content-stretch flex flex-col h-[940px] items-start relative shrink-0 w-full" data-name="Catalog">
      <Container5 />
      <Container8 />
    </div>
  );
}

function MainContent() {
  return (
    <div className="bg-[#f9fafb] flex-[1_0_0] min-h-px min-w-px relative w-[1376px]" data-name="Main Content">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip pr-[12px] relative rounded-[inherit] size-full">
        <Catalog1 />
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

export default function Catalog() {
  return (
    <div className="bg-white content-stretch flex items-start relative size-full" data-name="Catalog">
      <Sidebar />
      <Container1 />
    </div>
  );
}
import svgPaths from "./svg-mb5o5owk1c";

function PrimitiveButton() {
  return (
    <div className="basis-0 bg-white grow h-[29px] min-h-px min-w-px relative rounded-[14px] shrink-0" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[6px] h-[29px] items-center justify-center px-[9px] py-[5px] relative w-full">
          <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">検体検査</p>
        </div>
      </div>
    </div>
  );
}

function PrimitiveButton1() {
  return (
    <div className="basis-0 grow h-[29px] min-h-px min-w-px relative rounded-[14px] shrink-0" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[6px] h-[29px] items-center justify-center px-[9px] py-[5px] relative w-full">
          <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">生理検査</p>
        </div>
      </div>
    </div>
  );
}

function PrimitiveButton2() {
  return (
    <div className="basis-0 grow h-[29px] min-h-px min-w-px relative rounded-[14px] shrink-0" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[6px] h-[29px] items-center justify-center px-[9px] py-[5px] relative w-full">
          <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">病理</p>
        </div>
      </div>
    </div>
  );
}

function PrimitiveButton3() {
  return (
    <div className="basis-0 grow h-[29px] min-h-px min-w-px relative rounded-[14px] shrink-0" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[6px] h-[29px] items-center justify-center px-[9px] py-[5px] relative w-full">
          <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">細菌</p>
        </div>
      </div>
    </div>
  );
}

function PrimitiveDiv() {
  return (
    <div className="bg-[#ececf0] content-stretch flex h-[36px] items-center justify-center relative rounded-[14px] shrink-0 w-full" data-name="Primitive.div">
      <PrimitiveButton />
      <PrimitiveButton1 />
      <PrimitiveButton2 />
      <PrimitiveButton3 />
    </div>
  );
}

function App() {
  return (
    <div className="bg-gray-50 h-[53px] relative shrink-0 w-[1523px]" data-name="App">
      <div aria-hidden="true" className="absolute border-[#d1d5dc] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-[53px] items-start pb-px pl-[16px] pr-[1261px] pt-[8px] relative w-[1523px]">
        <PrimitiveDiv />
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="absolute left-[10px] size-[16px] top-[7px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p3155f180} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.pea6a680} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="absolute bg-white border border-[rgba(0,0,0,0.1)] border-solid h-[32px] left-[16px] rounded-[8px] top-[16px] w-[104.828px]" data-name="Button">
      <Icon />
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[63px] not-italic text-[14px] text-center text-neutral-950 text-nowrap top-[3px] translate-x-[-50%] whitespace-pre">グラフ表示</p>
    </div>
  );
}

function Text() {
  return (
    <div className="h-[20px] relative shrink-0 w-[71.969px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[20px] items-start relative w-[71.969px]">
        <p className="font-['Arial:Bold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">2024/09/15</p>
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_20225_551)" id="Icon">
          <path d={svgPaths.p216f800} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p13e4b3c0} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_20225_551">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[20px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[20px]">
        <Icon1 />
      </div>
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p405f80} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[20px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[20px]">
        <Icon2 />
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="absolute content-stretch flex gap-[6px] h-[20px] items-center justify-center left-[8.5px] top-[14px] w-[123.969px]" data-name="Container">
      <Text />
      <Button1 />
      <Button2 />
    </div>
  );
}

function HeaderCell() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[48.5px] left-[260.73px] top-0 w-[140.969px]" data-name="Header Cell">
      <Container />
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[20px] relative shrink-0 w-[74.063px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[20px] items-start relative w-[74.063px]">
        <p className="font-['Arial:Bold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">2024/08/20</p>
      </div>
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_20225_551)" id="Icon">
          <path d={svgPaths.p216f800} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p13e4b3c0} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_20225_551">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button3() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[20px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[20px]">
        <Icon3 />
      </div>
    </div>
  );
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p405f80} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button4() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[20px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[20px]">
        <Icon4 />
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute content-stretch flex gap-[6px] h-[20px] items-center justify-center left-[8.5px] top-[14px] w-[126.063px]" data-name="Container">
      <Text1 />
      <Button3 />
      <Button4 />
    </div>
  );
}

function HeaderCell1() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[48.5px] left-[401.7px] top-0 w-[143.063px]" data-name="Header Cell">
      <Container1 />
    </div>
  );
}

function Text2() {
  return (
    <div className="h-[20px] relative shrink-0 w-[71.656px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[20px] items-start relative w-[71.656px]">
        <p className="font-['Arial:Bold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">2024/07/18</p>
      </div>
    </div>
  );
}

function Icon5() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_20225_551)" id="Icon">
          <path d={svgPaths.p216f800} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p13e4b3c0} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_20225_551">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button5() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[20px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[20px]">
        <Icon5 />
      </div>
    </div>
  );
}

function Icon6() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p405f80} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button6() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[20px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[20px]">
        <Icon6 />
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute content-stretch flex gap-[6px] h-[20px] items-center justify-center left-[8.5px] top-[14px] w-[123.656px]" data-name="Container">
      <Text2 />
      <Button5 />
      <Button6 />
    </div>
  );
}

function HeaderCell2() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[48.5px] left-[544.77px] top-0 w-[140.656px]" data-name="Header Cell">
      <Container2 />
    </div>
  );
}

function Text3() {
  return (
    <div className="h-[20px] relative shrink-0 w-[74.109px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[20px] items-start relative w-[74.109px]">
        <p className="font-['Arial:Bold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">2024/06/22</p>
      </div>
    </div>
  );
}

function Icon7() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_20225_551)" id="Icon">
          <path d={svgPaths.p216f800} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p13e4b3c0} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_20225_551">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button7() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[20px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[20px]">
        <Icon7 />
      </div>
    </div>
  );
}

function Icon8() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p405f80} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button8() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[20px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[20px]">
        <Icon8 />
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute content-stretch flex gap-[6px] h-[20px] items-center justify-center left-[8.5px] top-[14px] w-[126.109px]" data-name="Container">
      <Text3 />
      <Button7 />
      <Button8 />
    </div>
  );
}

function HeaderCell3() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[48.5px] left-[685.42px] top-0 w-[143.109px]" data-name="Header Cell">
      <Container3 />
    </div>
  );
}

function Text4() {
  return (
    <div className="h-[20px] relative shrink-0 w-[74.063px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[20px] items-start relative w-[74.063px]">
        <p className="font-['Arial:Bold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">2024/05/25</p>
      </div>
    </div>
  );
}

function Icon9() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_20225_551)" id="Icon">
          <path d={svgPaths.p216f800} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p13e4b3c0} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_20225_551">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button9() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[20px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[20px]">
        <Icon9 />
      </div>
    </div>
  );
}

function Icon10() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p405f80} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button10() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[20px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[20px]">
        <Icon10 />
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="absolute content-stretch flex gap-[6px] h-[20px] items-center justify-center left-[8.5px] top-[14px] w-[126.063px]" data-name="Container">
      <Text4 />
      <Button9 />
      <Button10 />
    </div>
  );
}

function HeaderCell4() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[48.5px] left-[828.53px] top-0 w-[143.063px]" data-name="Header Cell">
      <Container4 />
    </div>
  );
}

function Text5() {
  return (
    <div className="h-[20px] relative shrink-0 w-[74.359px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[20px] items-start relative w-[74.359px]">
        <p className="font-['Arial:Bold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">2024/04/28</p>
      </div>
    </div>
  );
}

function Icon11() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_20225_551)" id="Icon">
          <path d={svgPaths.p216f800} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p13e4b3c0} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_20225_551">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button11() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[20px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[20px]">
        <Icon11 />
      </div>
    </div>
  );
}

function Icon12() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p405f80} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button12() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[20px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[20px]">
        <Icon12 />
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="absolute content-stretch flex gap-[6px] h-[20px] items-center justify-center left-[8.5px] top-[14px] w-[126.359px]" data-name="Container">
      <Text5 />
      <Button11 />
      <Button12 />
    </div>
  );
}

function HeaderCell5() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[48.5px] left-[971.59px] top-0 w-[143.359px]" data-name="Header Cell">
      <Container5 />
    </div>
  );
}

function Text6() {
  return (
    <div className="h-[20px] relative shrink-0 w-[74.063px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[20px] items-start relative w-[74.063px]">
        <p className="font-['Arial:Bold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">2024/03/20</p>
      </div>
    </div>
  );
}

function Icon13() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_20225_551)" id="Icon">
          <path d={svgPaths.p216f800} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p13e4b3c0} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_20225_551">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button13() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[20px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[20px]">
        <Icon13 />
      </div>
    </div>
  );
}

function Icon14() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p405f80} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button14() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[20px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[20px]">
        <Icon14 />
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="absolute content-stretch flex gap-[6px] h-[20px] items-center justify-center left-[8.5px] top-[14px] w-[126.063px]" data-name="Container">
      <Text6 />
      <Button13 />
      <Button14 />
    </div>
  );
}

function HeaderCell6() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[48.5px] left-[1114.95px] top-0 w-[143.063px]" data-name="Header Cell">
      <Container6 />
    </div>
  );
}

function Text7() {
  return (
    <div className="h-[20px] relative shrink-0 w-[71.922px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[20px] items-start relative w-[71.922px]">
        <p className="font-['Arial:Bold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">2024/02/15</p>
      </div>
    </div>
  );
}

function Icon15() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_20225_551)" id="Icon">
          <path d={svgPaths.p216f800} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p13e4b3c0} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_20225_551">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button15() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[20px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[20px]">
        <Icon15 />
      </div>
    </div>
  );
}

function Icon16() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p405f80} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button16() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[20px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[20px]">
        <Icon16 />
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="absolute content-stretch flex gap-[6px] h-[20px] items-center justify-center left-[8.5px] top-[14px] w-[123.922px]" data-name="Container">
      <Text7 />
      <Button15 />
      <Button16 />
    </div>
  );
}

function HeaderCell7() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[48.5px] left-[1258.02px] top-0 w-[140.922px]" data-name="Header Cell">
      <Container7 />
    </div>
  );
}

function Text8() {
  return (
    <div className="h-[20px] relative shrink-0 w-[69.781px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[20px] items-start relative w-[69.781px]">
        <p className="font-['Arial:Bold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">2024/01/18</p>
      </div>
    </div>
  );
}

function Icon17() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_20225_551)" id="Icon">
          <path d={svgPaths.p216f800} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p13e4b3c0} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_20225_551">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button17() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[20px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[20px]">
        <Icon17 />
      </div>
    </div>
  );
}

function Icon18() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p405f80} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button18() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[20px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[20px]">
        <Icon18 />
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="absolute box-border content-stretch flex gap-[6px] h-[20px] items-center justify-center left-[8.5px] pl-0 pr-[0.016px] py-0 top-[14px] w-[122.922px]" data-name="Container">
      <Text8 />
      <Button17 />
      <Button18 />
    </div>
  );
}

function HeaderCell8() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[48.5px] left-[1398.94px] top-0 w-[139.922px]" data-name="Header Cell">
      <Container8 />
    </div>
  );
}

function Text9() {
  return (
    <div className="h-[20px] relative shrink-0 w-[71.625px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[20px] items-start relative w-[71.625px]">
        <p className="font-['Arial:Bold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">2023/12/20</p>
      </div>
    </div>
  );
}

function Icon19() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_20225_551)" id="Icon">
          <path d={svgPaths.p216f800} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p13e4b3c0} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_20225_551">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button19() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[20px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[20px]">
        <Icon19 />
      </div>
    </div>
  );
}

function Icon20() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p405f80} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button20() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[20px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[20px]">
        <Icon20 />
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="absolute box-border content-stretch flex gap-[6px] h-[20px] items-center justify-center left-[8.5px] pl-0 pr-[0.016px] py-0 top-[14px] w-[123.641px]" data-name="Container">
      <Text9 />
      <Button19 />
      <Button20 />
    </div>
  );
}

function HeaderCell9() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[48.5px] left-[1538.86px] top-0 w-[140.641px]" data-name="Header Cell">
      <Container9 />
    </div>
  );
}

function TableRow() {
  return (
    <div className="absolute bg-gray-100 border-[#d1d5dc] border-[0px_0px_1px] border-solid h-[48.5px] left-0 top-0 w-[1679.5px]" data-name="Table Row">
      <HeaderCell />
      <HeaderCell1 />
      <HeaderCell2 />
      <HeaderCell3 />
      <HeaderCell4 />
      <HeaderCell5 />
      <HeaderCell6 />
      <HeaderCell7 />
      <HeaderCell8 />
      <HeaderCell9 />
    </div>
  );
}

function TableHeader() {
  return (
    <div className="absolute h-[48.5px] left-0 top-0 w-[1679.5px]" data-name="Table Header">
      <TableRow />
    </div>
  );
}

function TableRow1() {
  return <div className="absolute h-[37px] left-0 top-0 w-[1679.5px]" data-name="Table Row" />;
}

function Text10() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[61.41px] top-[14.5px] w-[18.141px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">6.2</p>
    </div>
  );
}

function TableCell() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-[260.73px] top-0 w-[140.969px]" data-name="Table Cell">
      <Text10 />
    </div>
  );
}

function Text11() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[62.45px] top-[14.5px] w-[18.141px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">5.8</p>
    </div>
  );
}

function TableCell1() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-[401.7px] top-0 w-[143.063px]" data-name="Table Cell">
      <Text11 />
    </div>
  );
}

function Text12() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[66.55px] top-[14.5px] w-[7.547px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">6</p>
    </div>
  );
}

function TableCell2() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-[544.77px] top-0 w-[140.656px]" data-name="Table Cell">
      <Text12 />
    </div>
  );
}

function Text13() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[62.48px] top-[14.5px] w-[18.141px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">5.5</p>
    </div>
  );
}

function TableCell3() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-[685.42px] top-0 w-[143.109px]" data-name="Table Cell">
      <Text13 />
    </div>
  );
}

function Text14() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[62.45px] top-[14.5px] w-[18.141px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">6.1</p>
    </div>
  );
}

function TableCell4() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-[828.53px] top-0 w-[143.063px]" data-name="Table Cell">
      <Text14 />
    </div>
  );
}

function Text15() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[62.61px] top-[14.5px] w-[18.141px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">5.9</p>
    </div>
  );
}

function TableCell5() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-[971.59px] top-0 w-[143.359px]" data-name="Table Cell">
      <Text15 />
    </div>
  );
}

function Text16() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[62.45px] top-[14.5px] w-[18.141px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">6.3</p>
    </div>
  );
}

function TableCell6() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-[1114.95px] top-0 w-[143.063px]" data-name="Table Cell">
      <Text16 />
    </div>
  );
}

function Text17() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[61.39px] top-[14.5px] w-[18.141px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">5.7</p>
    </div>
  );
}

function TableCell7() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-[1258.02px] top-0 w-[140.922px]" data-name="Table Cell">
      <Text17 />
    </div>
  );
}

function Text18() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[66.19px] top-[14.5px] w-[7.547px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">6</p>
    </div>
  );
}

function TableCell8() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-[1398.94px] top-0 w-[139.922px]" data-name="Table Cell">
      <Text18 />
    </div>
  );
}

function Text19() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[61.25px] top-[14.5px] w-[18.141px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">5.8</p>
    </div>
  );
}

function TableCell9() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-[1538.86px] top-0 w-[140.641px]" data-name="Table Cell">
      <Text19 />
    </div>
  );
}

function TableRow2() {
  return (
    <div className="absolute border-[0px_0px_1px] border-gray-200 border-solid h-[49px] left-0 top-[37px] w-[1679.5px]" data-name="Table Row">
      <TableCell />
      <TableCell1 />
      <TableCell2 />
      <TableCell3 />
      <TableCell4 />
      <TableCell5 />
      <TableCell6 />
      <TableCell7 />
      <TableCell8 />
      <TableCell9 />
    </div>
  );
}

function Text20() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[61.41px] top-[14.5px] w-[18.141px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">4.8</p>
    </div>
  );
}

function TableCell10() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-[260.73px] top-0 w-[140.969px]" data-name="Table Cell">
      <Text20 />
    </div>
  );
}

function Text21() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[62.45px] top-[14.5px] w-[18.141px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">4.7</p>
    </div>
  );
}

function TableCell11() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-[401.7px] top-0 w-[143.063px]" data-name="Table Cell">
      <Text21 />
    </div>
  );
}

function Text22() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[61.25px] top-[14.5px] w-[18.141px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">4.9</p>
    </div>
  );
}

function TableCell12() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-[544.77px] top-0 w-[140.656px]" data-name="Table Cell">
      <Text22 />
    </div>
  );
}

function Text23() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[62.48px] top-[14.5px] w-[18.141px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">4.6</p>
    </div>
  );
}

function TableCell13() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-[685.42px] top-0 w-[143.109px]" data-name="Table Cell">
      <Text23 />
    </div>
  );
}

function Text24() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[62.45px] top-[14.5px] w-[18.141px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">4.8</p>
    </div>
  );
}

function TableCell14() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-[828.53px] top-0 w-[143.063px]" data-name="Table Cell">
      <Text24 />
    </div>
  );
}

function Text25() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[62.61px] top-[14.5px] w-[18.141px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">4.5</p>
    </div>
  );
}

function TableCell15() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-[971.59px] top-0 w-[143.359px]" data-name="Table Cell">
      <Text25 />
    </div>
  );
}

function Text26() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[62.45px] top-[14.5px] w-[18.141px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">4.7</p>
    </div>
  );
}

function TableCell16() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-[1114.95px] top-0 w-[143.063px]" data-name="Table Cell">
      <Text26 />
    </div>
  );
}

function Text27() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[61.39px] top-[14.5px] w-[18.141px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">4.9</p>
    </div>
  );
}

function TableCell17() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-[1258.02px] top-0 w-[140.922px]" data-name="Table Cell">
      <Text27 />
    </div>
  );
}

function Text28() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[60.89px] top-[14.5px] w-[18.141px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">4.8</p>
    </div>
  );
}

function TableCell18() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-[1398.94px] top-0 w-[139.922px]" data-name="Table Cell">
      <Text28 />
    </div>
  );
}

function Text29() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[61.25px] top-[14.5px] w-[18.141px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">4.6</p>
    </div>
  );
}

function TableCell19() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-[1538.86px] top-0 w-[140.641px]" data-name="Table Cell">
      <Text29 />
    </div>
  );
}

function TableRow3() {
  return (
    <div className="absolute border-[0px_0px_1px] border-gray-200 border-solid h-[49px] left-0 top-[86px] w-[1679.5px]" data-name="Table Row">
      <TableCell10 />
      <TableCell11 />
      <TableCell12 />
      <TableCell13 />
      <TableCell14 />
      <TableCell15 />
      <TableCell16 />
      <TableCell17 />
      <TableCell18 />
      <TableCell19 />
    </div>
  );
}

function Text30() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[57.64px] top-[14.5px] w-[25.688px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">14.2</p>
    </div>
  );
}

function TableCell20() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-[260.73px] top-0 w-[140.969px]" data-name="Table Cell">
      <Text30 />
    </div>
  );
}

function Text31() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[58.69px] top-[14.5px] w-[25.688px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">13.8</p>
    </div>
  );
}

function TableCell21() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-[401.7px] top-0 w-[143.063px]" data-name="Table Cell">
      <Text31 />
    </div>
  );
}

function Text32() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[62.78px] top-[14.5px] w-[15.094px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">14</p>
    </div>
  );
}

function TableCell22() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-[544.77px] top-0 w-[140.656px]" data-name="Table Cell">
      <Text32 />
    </div>
  );
}

function Text33() {
  return (
    <div className="h-[20px] relative shrink-0 w-[25.688px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[20px] items-start relative w-[25.688px]">
        <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">12.5</p>
      </div>
    </div>
  );
}

function Text34() {
  return (
    <div className="bg-blue-100 h-[20px] relative rounded-[4px] shrink-0 w-[25.656px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[20px] items-center px-[4px] py-[2px] relative w-[25.656px]">
        <p className="font-['Arial:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#193cb8] text-[12px] text-center text-nowrap whitespace-pre">L↓</p>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="absolute box-border content-stretch flex gap-[4px] h-[20px] items-center justify-center left-[8.5px] pl-0 pr-[0.016px] py-0 top-[14.5px] w-[126.109px]" data-name="Container">
      <Text33 />
      <Text34 />
    </div>
  );
}

function TableCell23() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-[685.42px] top-0 w-[143.109px]" data-name="Table Cell">
      <Container10 />
    </div>
  );
}

function Text35() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[58.69px] top-[14.5px] w-[25.688px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">14.1</p>
    </div>
  );
}

function TableCell24() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-[828.53px] top-0 w-[143.063px]" data-name="Table Cell">
      <Text35 />
    </div>
  );
}

function Text36() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[58.83px] top-[14.5px] w-[25.688px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">13.5</p>
    </div>
  );
}

function TableCell25() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-[971.59px] top-0 w-[143.359px]" data-name="Table Cell">
      <Text36 />
    </div>
  );
}

function Text37() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[58.69px] top-[14.5px] w-[25.688px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">13.9</p>
    </div>
  );
}

function TableCell26() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-[1114.95px] top-0 w-[143.063px]" data-name="Table Cell">
      <Text37 />
    </div>
  );
}

function Text38() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[57.61px] top-[14.5px] w-[25.688px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">14.3</p>
    </div>
  );
}

function TableCell27() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-[1258.02px] top-0 w-[140.922px]" data-name="Table Cell">
      <Text38 />
    </div>
  );
}

function Text39() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[62.41px] top-[14.5px] w-[15.094px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">14</p>
    </div>
  );
}

function TableCell28() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-[1398.94px] top-0 w-[139.922px]" data-name="Table Cell">
      <Text39 />
    </div>
  );
}

function Text40() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[57.47px] top-[14.5px] w-[25.688px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">13.7</p>
    </div>
  );
}

function TableCell29() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-[1538.86px] top-0 w-[140.641px]" data-name="Table Cell">
      <Text40 />
    </div>
  );
}

function TableRow4() {
  return (
    <div className="absolute border-[0px_0px_1px] border-gray-200 border-solid h-[49px] left-0 top-[135px] w-[1679.5px]" data-name="Table Row">
      <TableCell20 />
      <TableCell21 />
      <TableCell22 />
      <TableCell23 />
      <TableCell24 />
      <TableCell25 />
      <TableCell26 />
      <TableCell27 />
      <TableCell28 />
      <TableCell29 />
    </div>
  );
}

function Text41() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[57.64px] top-[14.5px] w-[25.688px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">22.5</p>
    </div>
  );
}

function TableCell30() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-[260.73px] top-0 w-[140.969px]" data-name="Table Cell">
      <Text41 />
    </div>
  );
}

function Text42() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[58.69px] top-[14.5px] w-[25.688px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">24.1</p>
    </div>
  );
}

function TableCell31() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-[401.7px] top-0 w-[143.063px]" data-name="Table Cell">
      <Text42 />
    </div>
  );
}

function Text43() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[57.48px] top-[14.5px] w-[25.688px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">23.8</p>
    </div>
  );
}

function TableCell32() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-[544.77px] top-0 w-[140.656px]" data-name="Table Cell">
      <Text43 />
    </div>
  );
}

function Text44() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[58.7px] top-[14.5px] w-[25.688px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">21.9</p>
    </div>
  );
}

function TableCell33() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-[685.42px] top-0 w-[143.109px]" data-name="Table Cell">
      <Text44 />
    </div>
  );
}

function Text45() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[58.69px] top-[14.5px] w-[25.688px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">25.2</p>
    </div>
  );
}

function TableCell34() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-[828.53px] top-0 w-[143.063px]" data-name="Table Cell">
      <Text45 />
    </div>
  );
}

function Text46() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[58.83px] top-[14.5px] w-[25.688px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">23.5</p>
    </div>
  );
}

function TableCell35() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-[971.59px] top-0 w-[143.359px]" data-name="Table Cell">
      <Text46 />
    </div>
  );
}

function Text47() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[58.69px] top-[14.5px] w-[25.688px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">24.8</p>
    </div>
  );
}

function TableCell36() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-[1114.95px] top-0 w-[143.063px]" data-name="Table Cell">
      <Text47 />
    </div>
  );
}

function Text48() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[57.61px] top-[14.5px] w-[25.688px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">22.1</p>
    </div>
  );
}

function TableCell37() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-[1258.02px] top-0 w-[140.922px]" data-name="Table Cell">
      <Text48 />
    </div>
  );
}

function Text49() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[57.11px] top-[14.5px] w-[25.688px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">23.9</p>
    </div>
  );
}

function TableCell38() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-[1398.94px] top-0 w-[139.922px]" data-name="Table Cell">
      <Text49 />
    </div>
  );
}

function Text50() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[57.47px] top-[14.5px] w-[25.688px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">24.3</p>
    </div>
  );
}

function TableCell39() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-[1538.86px] top-0 w-[140.641px]" data-name="Table Cell">
      <Text50 />
    </div>
  );
}

function TableRow5() {
  return (
    <div className="absolute border-[0px_0px_1px] border-gray-200 border-solid h-[49px] left-0 top-[184px] w-[1679.5px]" data-name="Table Row">
      <TableCell30 />
      <TableCell31 />
      <TableCell32 />
      <TableCell33 />
      <TableCell34 />
      <TableCell35 />
      <TableCell36 />
      <TableCell37 />
      <TableCell38 />
      <TableCell39 />
    </div>
  );
}

function TableRow6() {
  return <div className="absolute h-[37px] left-0 top-[233px] w-[1679.5px]" data-name="Table Row" />;
}

function Text51() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[61.41px] top-[14.5px] w-[18.141px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">7.2</p>
    </div>
  );
}

function TableCell40() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-[260.73px] top-0 w-[140.969px]" data-name="Table Cell">
      <Text51 />
    </div>
  );
}

function Text52() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[62.45px] top-[14.5px] w-[18.141px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">7.1</p>
    </div>
  );
}

function TableCell41() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-[401.7px] top-0 w-[143.063px]" data-name="Table Cell">
      <Text52 />
    </div>
  );
}

function Text53() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[61.25px] top-[14.5px] w-[18.141px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">7.3</p>
    </div>
  );
}

function TableCell42() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-[544.77px] top-0 w-[140.656px]" data-name="Table Cell">
      <Text53 />
    </div>
  );
}

function Text54() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[67.78px] top-[14.5px] w-[7.547px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">7</p>
    </div>
  );
}

function TableCell43() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-[685.42px] top-0 w-[143.109px]" data-name="Table Cell">
      <Text54 />
    </div>
  );
}

function Text55() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[62.45px] top-[14.5px] w-[18.141px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">7.2</p>
    </div>
  );
}

function TableCell44() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-[828.53px] top-0 w-[143.063px]" data-name="Table Cell">
      <Text55 />
    </div>
  );
}

function Text56() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[62.61px] top-[14.5px] w-[18.141px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">7.4</p>
    </div>
  );
}

function TableCell45() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-[971.59px] top-0 w-[143.359px]" data-name="Table Cell">
      <Text56 />
    </div>
  );
}

function Text57() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[62.45px] top-[14.5px] w-[18.141px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">7.1</p>
    </div>
  );
}

function TableCell46() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-[1114.95px] top-0 w-[143.063px]" data-name="Table Cell">
      <Text57 />
    </div>
  );
}

function Text58() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[61.39px] top-[14.5px] w-[18.141px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">7.3</p>
    </div>
  );
}

function TableCell47() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-[1258.02px] top-0 w-[140.922px]" data-name="Table Cell">
      <Text58 />
    </div>
  );
}

function Text59() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[60.89px] top-[14.5px] w-[18.141px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">7.2</p>
    </div>
  );
}

function TableCell48() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-[1398.94px] top-0 w-[139.922px]" data-name="Table Cell">
      <Text59 />
    </div>
  );
}

function Text60() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[66.55px] top-[14.5px] w-[7.547px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">7</p>
    </div>
  );
}

function TableCell49() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-[1538.86px] top-0 w-[140.641px]" data-name="Table Cell">
      <Text60 />
    </div>
  );
}

function TableRow7() {
  return (
    <div className="absolute border-[0px_0px_1px] border-gray-200 border-solid h-[49px] left-0 top-[270px] w-[1679.5px]" data-name="Table Row">
      <TableCell40 />
      <TableCell41 />
      <TableCell42 />
      <TableCell43 />
      <TableCell44 />
      <TableCell45 />
      <TableCell46 />
      <TableCell47 />
      <TableCell48 />
      <TableCell49 />
    </div>
  );
}

function Text61() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[62.94px] top-[14.5px] w-[15.094px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">28</p>
    </div>
  );
}

function TableCell50() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-[260.73px] top-0 w-[140.969px]" data-name="Table Cell">
      <Text61 />
    </div>
  );
}

function Text62() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[63.98px] top-[14.5px] w-[15.094px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">32</p>
    </div>
  );
}

function TableCell51() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-[401.7px] top-0 w-[143.063px]" data-name="Table Cell">
      <Text62 />
    </div>
  );
}

function Text63() {
  return (
    <div className="h-[20px] relative shrink-0 w-[15.094px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[20px] items-start relative w-[15.094px]">
        <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">45</p>
      </div>
    </div>
  );
}

function Text64() {
  return (
    <div className="bg-[#ffedd4] h-[20px] relative rounded-[4px] shrink-0 w-[28.531px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[20px] items-center px-[4px] py-[2px] relative w-[28.531px]">
        <p className="font-['Arial:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#9f2d00] text-[12px] text-center text-nowrap whitespace-pre">H↑</p>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[20px] items-center justify-center left-[8.5px] top-[14.5px] w-[123.656px]" data-name="Container">
      <Text63 />
      <Text64 />
    </div>
  );
}

function TableCell52() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-[544.77px] top-0 w-[140.656px]" data-name="Table Cell">
      <Container11 />
    </div>
  );
}

function Text65() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[64px] top-[14.5px] w-[15.094px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">38</p>
    </div>
  );
}

function TableCell53() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-[685.42px] top-0 w-[143.109px]" data-name="Table Cell">
      <Text65 />
    </div>
  );
}

function Text66() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[63.98px] top-[14.5px] w-[15.094px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">30</p>
    </div>
  );
}

function TableCell54() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-[828.53px] top-0 w-[143.063px]" data-name="Table Cell">
      <Text66 />
    </div>
  );
}

function Text67() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[64.13px] top-[14.5px] w-[15.094px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">35</p>
    </div>
  );
}

function TableCell55() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-[971.59px] top-0 w-[143.359px]" data-name="Table Cell">
      <Text67 />
    </div>
  );
}

function Text68() {
  return (
    <div className="h-[20px] relative shrink-0 w-[15.094px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[20px] items-start relative w-[15.094px]">
        <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">42</p>
      </div>
    </div>
  );
}

function Text69() {
  return (
    <div className="bg-[#ffedd4] h-[20px] relative rounded-[4px] shrink-0 w-[28.531px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[20px] items-center px-[4px] py-[2px] relative w-[28.531px]">
        <p className="font-['Arial:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#9f2d00] text-[12px] text-center text-nowrap whitespace-pre">H↑</p>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[20px] items-center justify-center left-[8.5px] top-[14.5px] w-[126.063px]" data-name="Container">
      <Text68 />
      <Text69 />
    </div>
  );
}

function TableCell56() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-[1114.95px] top-0 w-[143.063px]" data-name="Table Cell">
      <Container12 />
    </div>
  );
}

function Text70() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[62.91px] top-[14.5px] w-[15.094px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">29</p>
    </div>
  );
}

function TableCell57() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-[1258.02px] top-0 w-[140.922px]" data-name="Table Cell">
      <Text70 />
    </div>
  );
}

function Text71() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[62.41px] top-[14.5px] w-[15.094px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">33</p>
    </div>
  );
}

function TableCell58() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-[1398.94px] top-0 w-[139.922px]" data-name="Table Cell">
      <Text71 />
    </div>
  );
}

function Text72() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[62.77px] top-[14.5px] w-[15.094px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">31</p>
    </div>
  );
}

function TableCell59() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-[1538.86px] top-0 w-[140.641px]" data-name="Table Cell">
      <Text72 />
    </div>
  );
}

function TableRow8() {
  return (
    <div className="absolute border-[0px_0px_1px] border-gray-200 border-solid h-[49px] left-0 top-[319px] w-[1679.5px]" data-name="Table Row">
      <TableCell50 />
      <TableCell51 />
      <TableCell52 />
      <TableCell53 />
      <TableCell54 />
      <TableCell55 />
      <TableCell56 />
      <TableCell57 />
      <TableCell58 />
      <TableCell59 />
    </div>
  );
}

function Text73() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[62.94px] top-[8.5px] w-[15.094px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">35</p>
    </div>
  );
}

function TableCell60() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[37px] left-[260.73px] top-0 w-[140.969px]" data-name="Table Cell">
      <Text73 />
    </div>
  );
}

function Text74() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[63.98px] top-[8.5px] w-[15.094px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">42</p>
    </div>
  );
}

function TableCell61() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[37px] left-[401.7px] top-0 w-[143.063px]" data-name="Table Cell">
      <Text74 />
    </div>
  );
}

function Text75() {
  return (
    <div className="h-[20px] relative shrink-0 w-[15.094px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[20px] items-start relative w-[15.094px]">
        <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">58</p>
      </div>
    </div>
  );
}

function Text76() {
  return (
    <div className="bg-[#ffedd4] h-[20px] relative rounded-[4px] shrink-0 w-[28.531px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[20px] items-center px-[4px] py-[2px] relative w-[28.531px]">
        <p className="font-['Arial:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#9f2d00] text-[12px] text-center text-nowrap whitespace-pre">H↑</p>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[20px] items-center justify-center left-[8.5px] top-[8.5px] w-[123.656px]" data-name="Container">
      <Text75 />
      <Text76 />
    </div>
  );
}

function TableCell62() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[37px] left-[544.77px] top-0 w-[140.656px]" data-name="Table Cell">
      <Container13 />
    </div>
  );
}

function Text77() {
  return (
    <div className="h-[20px] relative shrink-0 w-[15.094px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[20px] items-start relative w-[15.094px]">
        <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">48</p>
      </div>
    </div>
  );
}

function Text78() {
  return (
    <div className="bg-[#ffedd4] h-[20px] relative rounded-[4px] shrink-0 w-[28.531px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[20px] items-center px-[4px] py-[2px] relative w-[28.531px]">
        <p className="font-['Arial:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#9f2d00] text-[12px] text-center text-nowrap whitespace-pre">H↑</p>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="absolute box-border content-stretch flex gap-[4px] h-[20px] items-center justify-center left-[8.5px] pl-0 pr-[0.016px] py-0 top-[8.5px] w-[126.109px]" data-name="Container">
      <Text77 />
      <Text78 />
    </div>
  );
}

function TableCell63() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[37px] left-[685.42px] top-0 w-[143.109px]" data-name="Table Cell">
      <Container14 />
    </div>
  );
}

function Text79() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[63.98px] top-[8.5px] w-[15.094px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">38</p>
    </div>
  );
}

function TableCell64() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[37px] left-[828.53px] top-0 w-[143.063px]" data-name="Table Cell">
      <Text79 />
    </div>
  );
}

function Text80() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[64.13px] top-[8.5px] w-[15.094px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">44</p>
    </div>
  );
}

function TableCell65() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[37px] left-[971.59px] top-0 w-[143.359px]" data-name="Table Cell">
      <Text80 />
    </div>
  );
}

function Text81() {
  return (
    <div className="h-[20px] relative shrink-0 w-[15.094px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[20px] items-start relative w-[15.094px]">
        <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">52</p>
      </div>
    </div>
  );
}

function Text82() {
  return (
    <div className="bg-[#ffedd4] h-[20px] relative rounded-[4px] shrink-0 w-[28.531px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[20px] items-center px-[4px] py-[2px] relative w-[28.531px]">
        <p className="font-['Arial:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#9f2d00] text-[12px] text-center text-nowrap whitespace-pre">H↑</p>
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[20px] items-center justify-center left-[8.5px] top-[8.5px] w-[126.063px]" data-name="Container">
      <Text81 />
      <Text82 />
    </div>
  );
}

function TableCell66() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[37px] left-[1114.95px] top-0 w-[143.063px]" data-name="Table Cell">
      <Container15 />
    </div>
  );
}

function Text83() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[62.91px] top-[8.5px] w-[15.094px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">36</p>
    </div>
  );
}

function TableCell67() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[37px] left-[1258.02px] top-0 w-[140.922px]" data-name="Table Cell">
      <Text83 />
    </div>
  );
}

function Text84() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[62.41px] top-[8.5px] w-[15.094px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">40</p>
    </div>
  );
}

function TableCell68() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[37px] left-[1398.94px] top-0 w-[139.922px]" data-name="Table Cell">
      <Text84 />
    </div>
  );
}

function Text85() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[62.77px] top-[8.5px] w-[15.094px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">37</p>
    </div>
  );
}

function TableCell69() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[37px] left-[1538.86px] top-0 w-[140.641px]" data-name="Table Cell">
      <Text85 />
    </div>
  );
}

function TableRow9() {
  return (
    <div className="absolute border-[0px_0px_1px] border-gray-200 border-solid h-[37px] left-0 top-[368px] w-[1679.5px]" data-name="Table Row">
      <TableCell60 />
      <TableCell61 />
      <TableCell62 />
      <TableCell63 />
      <TableCell64 />
      <TableCell65 />
      <TableCell66 />
      <TableCell67 />
      <TableCell68 />
      <TableCell69 />
    </div>
  );
}

function Text86() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[61.41px] top-[14.5px] w-[18.141px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">0.9</p>
    </div>
  );
}

function TableCell70() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-[260.73px] top-0 w-[140.969px]" data-name="Table Cell">
      <Text86 />
    </div>
  );
}

function Text87() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[62.45px] top-[14.5px] w-[18.141px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">0.8</p>
    </div>
  );
}

function TableCell71() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-[401.7px] top-0 w-[143.063px]" data-name="Table Cell">
      <Text87 />
    </div>
  );
}

function Text88() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[61.25px] top-[14.5px] w-[18.141px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">1.1</p>
    </div>
  );
}

function TableCell72() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-[544.77px] top-0 w-[140.656px]" data-name="Table Cell">
      <Text88 />
    </div>
  );
}

function Text89() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[67.78px] top-[14.5px] w-[7.547px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">1</p>
    </div>
  );
}

function TableCell73() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-[685.42px] top-0 w-[143.109px]" data-name="Table Cell">
      <Text89 />
    </div>
  );
}

function Text90() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[62.45px] top-[14.5px] w-[18.141px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">0.9</p>
    </div>
  );
}

function TableCell74() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-[828.53px] top-0 w-[143.063px]" data-name="Table Cell">
      <Text90 />
    </div>
  );
}

function Text91() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[67.91px] top-[14.5px] w-[7.547px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">1</p>
    </div>
  );
}

function TableCell75() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-[971.59px] top-0 w-[143.359px]" data-name="Table Cell">
      <Text91 />
    </div>
  );
}

function Text92() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[62.45px] top-[14.5px] w-[18.141px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">0.8</p>
    </div>
  );
}

function TableCell76() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-[1114.95px] top-0 w-[143.063px]" data-name="Table Cell">
      <Text92 />
    </div>
  );
}

function Text93() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[61.39px] top-[14.5px] w-[18.141px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">0.9</p>
    </div>
  );
}

function TableCell77() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-[1258.02px] top-0 w-[140.922px]" data-name="Table Cell">
      <Text93 />
    </div>
  );
}

function Text94() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[60.89px] top-[14.5px] w-[18.141px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">1.1</p>
    </div>
  );
}

function TableCell78() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-[1398.94px] top-0 w-[139.922px]" data-name="Table Cell">
      <Text94 />
    </div>
  );
}

function Text95() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[61.25px] top-[14.5px] w-[18.141px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">0.9</p>
    </div>
  );
}

function TableCell79() {
  return (
    <div className="absolute border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-[1538.86px] top-0 w-[140.641px]" data-name="Table Cell">
      <Text95 />
    </div>
  );
}

function TableRow10() {
  return (
    <div className="absolute border-[0px_0px_1px] border-gray-200 border-solid h-[49px] left-0 top-[405px] w-[1679.5px]" data-name="Table Row">
      <TableCell70 />
      <TableCell71 />
      <TableCell72 />
      <TableCell73 />
      <TableCell74 />
      <TableCell75 />
      <TableCell76 />
      <TableCell77 />
      <TableCell78 />
      <TableCell79 />
    </div>
  );
}

function TableBody() {
  return (
    <div className="absolute h-[454px] left-0 top-[48.5px] w-[1679.5px]" data-name="Table Body">
      <TableRow1 />
      <TableRow2 />
      <TableRow3 />
      <TableRow4 />
      <TableRow5 />
      <TableRow6 />
      <TableRow7 />
      <TableRow8 />
      <TableRow9 />
      <TableRow10 />
    </div>
  );
}

function Table() {
  return (
    <div className="absolute h-[503px] left-0 top-0 w-[1680px]" data-name="Table">
      <TableHeader />
      <TableBody />
    </div>
  );
}

function Icon21() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p3de7e600} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function PrimitiveSpan() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 size-[14px] top-0" data-name="Primitive.span">
      <Icon21 />
    </div>
  );
}

function PrimitiveButton4() {
  return (
    <div className="absolute bg-[#030213] border border-[#030213] border-solid left-[8px] rounded-[4px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] size-[16px] top-[14px]" data-name="Primitive.button">
      <PrimitiveSpan />
    </div>
  );
}

function HeaderCell10() {
  return (
    <div className="absolute bg-gray-100 border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[48.5px] left-0 top-0 w-[32.5px]" data-name="Header Cell">
      <PrimitiveButton4 />
    </div>
  );
}

function HeaderCell11() {
  return (
    <div className="absolute bg-gray-100 border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[48.5px] left-[32.5px] top-0 w-[184.422px]" data-name="Header Cell">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[20px] left-[8.5px] not-italic text-[14px] text-neutral-950 text-nowrap top-[12px] whitespace-pre">検査項目</p>
    </div>
  );
}

function HeaderCell12() {
  return (
    <div className="absolute bg-gray-100 border-[#99a1af] border-[0px_1px_0px_0px] border-solid h-[48.5px] left-[224px] top-0 w-[43.813px]" data-name="Header Cell">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[16px] left-[21.91px] not-italic text-[12px] text-center text-neutral-950 top-[7px] translate-x-[-50%] w-[24px]">基準値</p>
    </div>
  );
}

function BoldText() {
  return (
    <div className="absolute content-stretch flex h-[19px] items-start left-[8px] top-[8.5px] w-[56px]" data-name="Bold Text">
      <p className="font-['Arial:Bold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-neutral-950 text-nowrap whitespace-pre">血液検査</p>
    </div>
  );
}

function TableCell80() {
  return (
    <div className="absolute bg-gray-50 border-[#d1d5dc] border-[0px_0px_1px] border-solid h-[37px] left-0 top-[48.5px] w-[1679.5px]" data-name="Table Cell">
      <BoldText />
    </div>
  );
}

function Icon22() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p3de7e600} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function PrimitiveSpan1() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 size-[14px] top-0" data-name="Primitive.span">
      <Icon22 />
    </div>
  );
}

function PrimitiveButton5() {
  return (
    <div className="absolute bg-[#030213] border border-[#030213] border-solid left-[8px] rounded-[4px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] size-[16px] top-[14.5px]" data-name="Primitive.button">
      <PrimitiveSpan1 />
    </div>
  );
}

function TableCell81() {
  return (
    <div className="absolute bg-white border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-0 top-[85.5px] w-[32.5px]" data-name="Table Cell">
      <PrimitiveButton5 />
    </div>
  );
}

function TableCell82() {
  return (
    <div className="absolute bg-white border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-[32.5px] top-[85.5px] w-[184.422px]" data-name="Table Cell">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[8.5px] not-italic text-[14px] text-neutral-950 text-nowrap top-[12.5px] whitespace-pre">白血球数 (×10³/μL)</p>
    </div>
  );
}

function TableCell83() {
  return (
    <div className="absolute bg-white border-[#99a1af] border-[0px_1px_0px_0px] border-solid h-[49px] left-[224px] top-[85.5px] w-[43.813px]" data-name="Table Cell">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-[22.23px] not-italic text-[#4a5565] text-[12px] text-center top-[7.5px] translate-x-[-50%] w-[21px]">4.0-8.0</p>
    </div>
  );
}

function Icon23() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p3de7e600} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function PrimitiveSpan2() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 size-[14px] top-0" data-name="Primitive.span">
      <Icon23 />
    </div>
  );
}

function PrimitiveButton6() {
  return (
    <div className="absolute bg-[#030213] border border-[#030213] border-solid left-[8px] rounded-[4px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] size-[16px] top-[14.5px]" data-name="Primitive.button">
      <PrimitiveSpan2 />
    </div>
  );
}

function TableCell84() {
  return (
    <div className="absolute bg-white border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-0 top-[134.5px] w-[32.5px]" data-name="Table Cell">
      <PrimitiveButton6 />
    </div>
  );
}

function TableCell85() {
  return (
    <div className="absolute bg-white border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-[32.5px] top-[134.5px] w-[184.422px]" data-name="Table Cell">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[8.5px] not-italic text-[14px] text-neutral-950 text-nowrap top-[12.5px] whitespace-pre">赤血球数 (×10⁶/μL)</p>
    </div>
  );
}

function TableCell86() {
  return (
    <div className="absolute bg-white border-[#99a1af] border-[0px_1px_0px_0px] border-solid h-[49px] left-[224px] top-[134.5px] w-[43.813px]" data-name="Table Cell">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-[22.23px] not-italic text-[#4a5565] text-[12px] text-center top-[7.5px] translate-x-[-50%] w-[21px]">4.2-5.4</p>
    </div>
  );
}

function Icon24() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p3de7e600} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function PrimitiveSpan3() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 size-[14px] top-0" data-name="Primitive.span">
      <Icon24 />
    </div>
  );
}

function PrimitiveButton7() {
  return (
    <div className="absolute bg-[#030213] border border-[#030213] border-solid left-[8px] rounded-[4px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] size-[16px] top-[14.5px]" data-name="Primitive.button">
      <PrimitiveSpan3 />
    </div>
  );
}

function TableCell87() {
  return (
    <div className="absolute bg-white border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-0 top-[183.5px] w-[32.5px]" data-name="Table Cell">
      <PrimitiveButton7 />
    </div>
  );
}

function TableCell88() {
  return (
    <div className="absolute bg-white border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-[32.5px] top-[183.5px] w-[184.422px]" data-name="Table Cell">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[8.5px] not-italic text-[14px] text-neutral-950 text-nowrap top-[12.5px] whitespace-pre">ヘモグロビン (g/dL)</p>
    </div>
  );
}

function TableCell89() {
  return (
    <div className="absolute bg-white border-[#99a1af] border-[0px_1px_0px_0px] border-solid h-[49px] left-[224px] top-[183.5px] w-[43.813px]" data-name="Table Cell">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-[22px] not-italic text-[#4a5565] text-[12px] text-center top-[7.5px] translate-x-[-50%] w-[27px]">13.0-17.0</p>
    </div>
  );
}

function Icon25() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p3de7e600} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function PrimitiveSpan4() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 size-[14px] top-0" data-name="Primitive.span">
      <Icon25 />
    </div>
  );
}

function PrimitiveButton8() {
  return (
    <div className="absolute bg-[#030213] border border-[#030213] border-solid left-[8px] rounded-[4px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] size-[16px] top-[14.5px]" data-name="Primitive.button">
      <PrimitiveSpan4 />
    </div>
  );
}

function TableCell90() {
  return (
    <div className="absolute bg-white border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-0 top-[232.5px] w-[32.5px]" data-name="Table Cell">
      <PrimitiveButton8 />
    </div>
  );
}

function TableCell91() {
  return (
    <div className="absolute bg-white border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-[32.5px] top-[232.5px] w-[184.422px]" data-name="Table Cell">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[8.5px] not-italic text-[14px] text-neutral-950 text-nowrap top-[12.5px] whitespace-pre">血小板数 (×10⁴/μL)</p>
    </div>
  );
}

function TableCell92() {
  return (
    <div className="absolute bg-white border-[#99a1af] border-[0px_1px_0px_0px] border-solid h-[49px] left-[224px] top-[232.5px] w-[43.813px]" data-name="Table Cell">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-[22px] not-italic text-[#4a5565] text-[12px] text-center top-[7.5px] translate-x-[-50%] w-[27px]">15.0-35.0</p>
    </div>
  );
}

function BoldText1() {
  return (
    <div className="absolute content-stretch flex h-[19px] items-start left-[8px] top-[8.5px] w-[70px]" data-name="Bold Text">
      <p className="font-['Arial:Bold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-neutral-950 text-nowrap whitespace-pre">生化学検査</p>
    </div>
  );
}

function TableCell93() {
  return (
    <div className="absolute bg-gray-50 border-[#d1d5dc] border-[0px_0px_1px] border-solid h-[37px] left-0 top-[281.5px] w-[1679.5px]" data-name="Table Cell">
      <BoldText1 />
    </div>
  );
}

function Icon26() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p3de7e600} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function PrimitiveSpan5() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 size-[14px] top-0" data-name="Primitive.span">
      <Icon26 />
    </div>
  );
}

function PrimitiveButton9() {
  return (
    <div className="absolute bg-[#030213] border border-[#030213] border-solid left-[8px] rounded-[4px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] size-[16px] top-[14.5px]" data-name="Primitive.button">
      <PrimitiveSpan5 />
    </div>
  );
}

function TableCell94() {
  return (
    <div className="absolute bg-white border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-0 top-[318.5px] w-[32.5px]" data-name="Table Cell">
      <PrimitiveButton9 />
    </div>
  );
}

function TableCell95() {
  return (
    <div className="absolute bg-white border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-[32.5px] top-[318.5px] w-[184.422px]" data-name="Table Cell">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[8.5px] not-italic text-[14px] text-neutral-950 text-nowrap top-[12.5px] whitespace-pre">総蛋白 (g/dL)</p>
    </div>
  );
}

function TableCell96() {
  return (
    <div className="absolute bg-white border-[#99a1af] border-[0px_1px_0px_0px] border-solid h-[49px] left-[224px] top-[318.5px] w-[43.813px]" data-name="Table Cell">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-[22.23px] not-italic text-[#4a5565] text-[12px] text-center top-[7.5px] translate-x-[-50%] w-[21px]">6.7-8.3</p>
    </div>
  );
}

function Icon27() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p3de7e600} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function PrimitiveSpan6() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 size-[14px] top-0" data-name="Primitive.span">
      <Icon27 />
    </div>
  );
}

function PrimitiveButton10() {
  return (
    <div className="absolute bg-[#030213] border border-[#030213] border-solid left-[8px] rounded-[4px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] size-[16px] top-[14.5px]" data-name="Primitive.button">
      <PrimitiveSpan6 />
    </div>
  );
}

function TableCell97() {
  return (
    <div className="absolute bg-white border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-0 top-[367.5px] w-[32.5px]" data-name="Table Cell">
      <PrimitiveButton10 />
    </div>
  );
}

function TableCell98() {
  return (
    <div className="absolute bg-white border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-[32.5px] top-[367.5px] w-[184.422px]" data-name="Table Cell">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[8.5px] not-italic text-[14px] text-neutral-950 text-nowrap top-[12.5px] whitespace-pre">AST (U/L)</p>
    </div>
  );
}

function TableCell99() {
  return (
    <div className="absolute bg-white border-[#99a1af] border-[0px_1px_0px_0px] border-solid h-[49px] left-[224px] top-[367.5px] w-[43.813px]" data-name="Table Cell">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-[22.03px] not-italic text-[#4a5565] text-[12px] text-center top-[7.5px] translate-x-[-50%] w-[18px]">10-40</p>
    </div>
  );
}

function Icon28() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p3de7e600} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function PrimitiveSpan7() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 size-[14px] top-0" data-name="Primitive.span">
      <Icon28 />
    </div>
  );
}

function PrimitiveButton11() {
  return (
    <div className="absolute bg-[#030213] border border-[#030213] border-solid left-[8px] rounded-[4px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] size-[16px] top-[8.5px]" data-name="Primitive.button">
      <PrimitiveSpan7 />
    </div>
  );
}

function TableCell100() {
  return (
    <div className="absolute bg-white border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[37px] left-0 top-[416.5px] w-[32.5px]" data-name="Table Cell">
      <PrimitiveButton11 />
    </div>
  );
}

function TableCell101() {
  return (
    <div className="absolute bg-white border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[37px] left-[32.5px] top-[416.5px] w-[184.422px]" data-name="Table Cell">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[8.5px] not-italic text-[14px] text-neutral-950 text-nowrap top-[6.5px] whitespace-pre">ALT (U/L)</p>
    </div>
  );
}

function TableCell102() {
  return (
    <div className="absolute bg-white border-[#99a1af] border-[0px_1px_0px_0px] border-solid h-[37px] left-[224px] top-[416.5px] w-[43.813px]" data-name="Table Cell">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-[22.3px] not-italic text-[#4a5565] text-[12px] text-center text-nowrap top-[9.5px] translate-x-[-50%] whitespace-pre">5-45</p>
    </div>
  );
}

function Icon29() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p3de7e600} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function PrimitiveSpan8() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 size-[14px] top-0" data-name="Primitive.span">
      <Icon29 />
    </div>
  );
}

function PrimitiveButton12() {
  return (
    <div className="absolute bg-[#030213] border border-[#030213] border-solid left-[8px] rounded-[4px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] size-[16px] top-[14.5px]" data-name="Primitive.button">
      <PrimitiveSpan8 />
    </div>
  );
}

function TableCell103() {
  return (
    <div className="absolute bg-white border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-0 top-[453.5px] w-[32.5px]" data-name="Table Cell">
      <PrimitiveButton12 />
    </div>
  );
}

function TableCell104() {
  return (
    <div className="absolute bg-white border-[#d1d5dc] border-[0px_1px_0px_0px] border-solid h-[49px] left-[32.5px] top-[453.5px] w-[184.422px]" data-name="Table Cell">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[8.5px] not-italic text-[14px] text-neutral-950 text-nowrap top-[12.5px] whitespace-pre">クレアチニン (mg/dL)</p>
    </div>
  );
}

function TableCell105() {
  return (
    <div className="absolute bg-white border-[#99a1af] border-[0px_1px_0px_0px] border-solid h-[49px] left-[224px] top-[453.5px] w-[43.813px]" data-name="Table Cell">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-[22.23px] not-italic text-[#4a5565] text-[12px] text-center top-[7.5px] translate-x-[-50%] w-[21px]">0.6-1.2</p>
    </div>
  );
}

function Container16() {
  return (
    <div className="absolute bg-white border border-[#99a1af] border-solid h-[520px] left-[16px] overflow-clip top-[56px] w-[1491px]" data-name="Container">
      <Table />
      <HeaderCell10 />
      <HeaderCell11 />
      <HeaderCell12 />
      <TableCell80 />
      <TableCell81 />
      <TableCell82 />
      <TableCell83 />
      <TableCell84 />
      <TableCell85 />
      <TableCell86 />
      <TableCell87 />
      <TableCell88 />
      <TableCell89 />
      <TableCell90 />
      <TableCell91 />
      <TableCell92 />
      <TableCell93 />
      <TableCell94 />
      <TableCell95 />
      <TableCell96 />
      <TableCell97 />
      <TableCell98 />
      <TableCell99 />
      <TableCell100 />
      <TableCell101 />
      <TableCell102 />
      <TableCell103 />
      <TableCell104 />
      <TableCell105 />
    </div>
  );
}

function Container17() {
  return (
    <div className="h-[592px] relative shrink-0 w-full" data-name="Container">
      <Button />
      <Container16 />
    </div>
  );
}

function Container18() {
  return (
    <div className="basis-0 grow h-[814px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-[814px] items-start overflow-clip relative rounded-[inherit] w-full">
        <Container17 />
      </div>
    </div>
  );
}

function TestResultMatrix() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-[1523px]" data-name="TestResultMatrix">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-full items-start overflow-clip relative rounded-[inherit] w-[1523px]">
        <Container18 />
      </div>
    </div>
  );
}

function PrimitiveDiv1() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-[1523px]" data-name="Primitive.div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[8px] h-full items-start overflow-clip relative rounded-[inherit] w-[1523px]">
        <App />
        <TestResultMatrix />
      </div>
    </div>
  );
}

function Icon30() {
  return (
    <div className="absolute left-[13px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_20225_542)" id="Icon">
          <path d={svgPaths.p3397ec80} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p4adfe2c} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p27a74a00} id="Vector_3" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_20225_542">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button21() {
  return (
    <div className="bg-white h-[36px] relative rounded-[8px] shrink-0 w-[82px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[36px] relative w-[82px]">
        <Icon30 />
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[55px] not-italic text-[14px] text-center text-neutral-950 text-nowrap top-[6px] translate-x-[-50%] whitespace-pre">印刷</p>
      </div>
    </div>
  );
}

function Icon31() {
  return (
    <div className="absolute left-[13px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M12 4L4 12" id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M4 4L12 12" id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button22() {
  return (
    <div className="bg-white h-[36px] relative rounded-[8px] shrink-0 w-[89.125px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[36px] relative w-[89.125px]">
        <Icon31 />
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[59px] not-italic text-[14px] text-center text-neutral-950 text-nowrap top-[6px] translate-x-[-50%] whitespace-pre">閉じる</p>
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="content-stretch flex gap-[8px] h-[36px] items-start justify-end relative shrink-0 w-full" data-name="Container">
      <Button21 />
      <Button22 />
    </div>
  );
}

function ActionButtons() {
  return null;
}

function Section() {
  return (
    <div className="h-0 relative shrink-0 w-[1523px]" data-name="Section">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-0 w-[1523px]" />
    </div>
  );
}

function App1() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[944px] items-start left-0 top-0 w-[1523px]" data-name="App">
      <PrimitiveDiv1 />
      <ActionButtons />
      <Section />
    </div>
  );
}

function Text96() {
  return (
    <div className="absolute content-stretch flex h-[16.5px] items-start left-0 top-[-20000px] w-[11.859px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[16.5px] not-italic relative shrink-0 text-[11px] text-neutral-950 text-nowrap whitespace-pre">15</p>
    </div>
  );
}

export default function Rec() {
  return (
    <div className="bg-white relative size-full" data-name="【REC008】検査結果参照">
      <App1 />
      <Text96 />
    </div>
  );
}
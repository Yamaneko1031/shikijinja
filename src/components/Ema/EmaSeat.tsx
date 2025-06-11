import { EmaPostResponse, TextBlock } from '@/types/ema';
import { defaultTextRectSize } from '@/config/ema';
import { fontList, fontColorList } from '@/config/fonts';
import { emaList } from '@/config/ema';

interface EmaItemProps {
  emaPostResponse: EmaPostResponse;
}

export default function EmaSeat({ emaPostResponse }: EmaItemProps) {
  return (
    <div className="w-[15rem] flex flex-col items-center justify-center gap-2">
      <div className="text-white/90 text-sm">~ 神様から一言 ~</div>
      <div className="flex flex-row items-start justify-center gap-2">
        <div
          className="w-[4rem] h-[4rem] rounded-md bg-[length:100%_100%]"
          style={{
            backgroundImage: `url('/images/illust/${emaList[emaPostResponse.emaImage].illustname}')`,
          }}
        ></div>
        <div className="w-[12.5rem] bg-white/10 backdrop-blur-sm text-[0.875rem] text-white px-3 py-2 rounded-lg shadow-lg text-center whitespace-pre-wrap select-none">
          {emaPostResponse.reply}
        </div>
      </div>
      <div className="min-w-[15rem] h-[15rem] relative text-center">
        <div
          className="w-full h-full bg-[length:100%_100%]"
          style={{
            backgroundImage: `url('/images/ema/${emaList[emaPostResponse.emaImage].filename}')`,
          }}
          // className={`w-full h-full bg-[url('/images/ema/${emaList[emaPostResponse.emaImage].filename}')] bg-[length:100%_100%]`}
        >
          <div
            className="absolute flex items-center justify-center overflow-hidden"
            style={{
              width: `${defaultTextRectSize.width}rem`,
              height: `${defaultTextRectSize.height}rem`,
              top: `${defaultTextRectSize.top}rem`,
              left: `${defaultTextRectSize.left}rem`,
            }}
          >
            {emaPostResponse.texts.map((block: TextBlock, i) => (
              <p
                key={i}
                className={`absolute ${fontList.find((f) => f.key === block.font)?.className} text-center whitespace-pre-wrap text-shadow select-none ${
                  block.isVertical ? 'vertical' : ''
                }`}
                style={{
                  maxWidth: block.isVertical ? undefined : `${block.textWidth}rem`,
                  maxHeight: block.isVertical ? `${block.textHeight}rem` : undefined,
                  color: fontColorList.find((c) => c.key === block.fontColor)?.value,
                  transform: `translate(${block.offsetX}rem, ${block.offsetY}rem) rotate(${block.textRotate}deg)`,
                  lineHeight: block.lineHeight,
                  fontSize: `${block.fontSize}rem`,
                }}
              >
                {block.text}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

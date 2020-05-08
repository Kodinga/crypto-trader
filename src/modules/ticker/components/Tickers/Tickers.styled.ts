import styled from 'styled-components';
import { range } from 'lodash';
import { Container as TickerContainer } from '../Ticker/Ticker.styled';

export type ScrollDirection = 'left' | 'right';

export const Container = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
    gap: 10px;
`;

export const TickerWrapper = styled.div<{
    index: number;
    itemCount: number;
    direction: ScrollDirection;
}>`

    ${({itemCount}) => {
        const animations = range(0, itemCount)
        .map(index => {
            const indexThreshold = Math.floor(itemCount / 2);
            const val = index <= indexThreshold
                 ? index
                 : indexThreshold - Math.abs(indexThreshold - index);
            const scaleFactor = 1 - ((indexThreshold - val) / 10);

            return `
            @keyframes slide-in-${index} {
                100% { transform: scale(${scaleFactor}, ${scaleFactor}) translateX(0%);; }
            }
            `;
        });

        return animations.reduce((acc, a) => acc += a, '');
    }}

    ${TickerContainer} {
        animation: ${({index}) => `slide-in-${index} 0.5s forwards;`};
        transform: ${({direction}) => `translateX(${direction === 'left' ? 100 : -100}%);`};
    }
`;
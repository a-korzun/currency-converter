import React from 'react';
import * as d3 from 'd3';
import { useRef } from 'react';
import { useEffect } from 'react';

interface Props {
  history: ExchangeHistoryItem[];
  width: number;
  height: number;
}

const style = getComputedStyle(document.body);

function Chart({ history, width, height }: Props) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const createSVG = () => {
      const stroke = style.getPropertyValue('--color-accent');
      const margin = 20;

      const scaleX = d3
        .scaleUtc()
        .domain(d3.extent(history, d => new Date(d.timestamp)) as [Date, Date])
        .range([margin, width - margin]);

      const scaleY = d3
        .scaleLinear()
        .domain([d3.min(history, d => Number(d.rate)), d3.max(history, d => Number(d.rate))] as [number, number])
        .nice()
        .range([height - margin, margin]);

      const xAxis = (g: any) => g
        .attr('transform', `translate(0,${height - margin})`)
        .call(d3.axisBottom(scaleX).ticks(history.length).tickSizeOuter(0));

      const yAxis = (g: any) => g
        .attr('transform', `translate(${margin},0)`)
        .call(d3.axisLeft(scaleY));

      const path = d3
        .line<{ timestamp: string; rate: string }>()
        .x((d: ExchangeHistoryItem) => scaleX(new Date(d.timestamp)))
        .y((d: ExchangeHistoryItem) => scaleY(Number(d.rate)));

      const svg = d3
        .create('svg')
        .attr('viewBox', `0, 0, ${width}, ${height}`)
        .attr('width', width)
        .attr('height', height);

      svg
        .append('g')
        .call(xAxis);

      svg
        .append('g')
        .call(yAxis);

      svg
        .append('path')
        .datum(history)
        .attr('fill', 'none')
        .attr('stroke', stroke)
        .attr('stroke-width', 2)
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .attr('d', path);

        return svg.node();
    }
    const rootNode = root.current;

    rootNode?.appendChild(createSVG() as Node);

    return () => {
      if (rootNode && rootNode.firstChild) {
        rootNode.removeChild(rootNode.firstChild);
      }
    }
  }, [history, width, height]);

  return (
    <div ref={root} />
  )
}

export default Chart;
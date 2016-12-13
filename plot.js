'strict on';

(function(d,w) {
    d.jlettvin = d.jlettvin || {};
    d.jlettvin.plot = d.jlettvin.plot || {};
    //actualize("d.jlettvin.plot");

    d.jlettvin.plot.draw = function(canvasname, lines, shape) {
        var axisWidth   = shape.font.size + 5;
        var halfWidth   = axisWidth / 2;

        var plotWidth  = shape.width;
        var plotHeight = shape.height;
        var plotMargin = shape.margin;

        var frameWidth  = plotWidth  + 2 * plotMargin + axisWidth * lines.length;
        var frameHeight = plotHeight + 2 * plotMargin;

        var canvas=document.getElementById(canvasname);
        canvas.setAttribute("width" , frameWidth );
        canvas.setAttribute("height", frameHeight);

        var ctx=canvas.getContext("2d");
        var xLeft = plotMargin, yTop = plotMargin;

        // Fill frame basic color
        ctx.fillStyle = shape.frame.color;
        ctx.fillRect(0, 0, frameWidth, canvas.height);

        // Fill plot basic color
        ctx.fillStyle = shape.back.color;
        ctx.fillRect(plotMargin, plotMargin, plotWidth, plotHeight);

        // Fill vertical grid lines
        for (var x=0; x < plotWidth; x+=10) {
            ctx.strokeStyle = shape.grid.color;
            ctx.beginPath();
            ctx.moveTo(xLeft+x,yTop+0);
            ctx.lineTo(xLeft+x,yTop+plotHeight);
            ctx.stroke();
        }

        // Fill horizontal grid lines
        for (var y=0; y < plotHeight; y+=10) {
            ctx.strokeStyle = shape.grid.color;
            ctx.beginPath();
            ctx.moveTo(xLeft, yTop+y);
            ctx.lineTo(xLeft+plotWidth, yTop+y);
            ctx.stroke();
        }

        // draw data
        for (var n = 0; n < lines.length; ++n) {
            // For a particular line
            line = lines[n];
            var dCount  = line.data.length;

            // If there is any data for this line
            if (dCount) {
                // Calculate the various offsets and scales
                var dDiff   = plotWidth - dCount;
                var dBegin  = Math.max(0, -dDiff);
                var xBegin  = Math.max(0, +dDiff);
                var yOffset = yTop + plotHeight;
                var yScale  = plotHeight / (line.ymax - line.ymin);

                // Fill the axis for this line
                ctx.strokeStyle = line.color;
                ctx.fillStyle = line.color;
                ctx.beginPath();
                var xAxis = plotWidth + plotMargin * 2 + n * axisWidth + halfWidth;
                ctx.moveTo(xAxis, plotMargin);
                ctx.lineTo(xAxis, yOffset);
                ctx.stroke();

                // Keep a copy of the way things are
                ctx.save();
                // Fill axis
                ctx.translate(xAxis, plotMargin + plotHeight / 2);
                // Calculate limits (apologies for manifest constants)
                // TODO: fix calculations to keep values at edges of frame
                var dx = -18, dy = -9, dFont = -3;
                var xo = 0.5 * plotHeight, yAxis = shape.font.size + dy;
                var xUpper = -xo - dx, xLower = +xo + dx;
                // Turn everything sideways
                ctx.rotate(Math.PI/2);
                ctx.textAlign = "center";
                // Fill label
                ctx.font = "" + shape.font.size + "px " + shape.font.face;
                ctx.fillText(line.label, 0, shape.font.size + dFont);
                // Fill limits (apologies for manifest constants)
                ctx.font = "10px " + shape.font.face;
                ctx.fillText(line.ymax.toExponential(1), xUpper, yAxis);
                ctx.fillText(line.ymin.toExponential(1), xLower, yAxis);
                // Put things back the way they were
                ctx.restore();

                // Plot the data into the plot area offset to the right for insufficient
                ctx.beginPath();
                var d = dBegin;
                var y = yOffset - yScale * (line.data[d] - line.ymin);
                ctx.moveTo(xLeft + xBegin, y);
                while (++d < dCount) {
                    y = yOffset - yScale * (line.data[d] - line.ymin);
                    ctx.lineTo(xLeft + xBegin + d, y);
                }
                ctx.stroke();
            }
        }
    }
})(document, window);

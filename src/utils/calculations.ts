
export function lerp(start: number, stop: number, amt: number): number {
    return amt * (stop - start) + start;
};

export function dist(...args: any): number {

    if (args.length === 4) {
      //2D
      return Math.hypot(args[2] - args[0], args[3] - args[1]);
    } else if (args.length === 6) {
      //3D
      return Math.hypot(args[3] - args[0], args[4] - args[1], args[5] - args[2]);
    } else {
        return 0;
    }
  };

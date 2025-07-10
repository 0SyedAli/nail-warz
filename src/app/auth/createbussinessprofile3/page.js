"use client";
import { AuthBtn } from "@/components/AuthBtn/AuthBtn";
import InputField from "@/components/Form/InputField";
import { useRouter } from "next/navigation";
export default function LoginPage() {
  const router = useRouter();
  const handleLogin = () => {
    router.push("/dashboard/dashboard-panel");
  };

  return (
    <form className="position-relative mt-5 pt-0">
      <fieldset>
        <div className="calender_container">
          <label htmlFor="email" className="pb-1">
            Add Category
          </label>
          <div className="d-flex my-3 " style={{ gap: 10 }}>
            <div className="calender_item">
              <input type="radio" defaultChecked id="radio101" name="day1" />
              <label htmlFor="radio101">Mon</label>
              <div className="calender_spot"></div>
            </div>
            <div className="calender_item">
              <input type="radio" id="radio102" name="day1" />
              <label htmlFor="radio102">Tue</label>
              <div className="calender_spot"></div>
            </div>
            <div className="calender_item">
              <input type="radio" id="radio103" name="day1" />
              <label htmlFor="radio103">Wed</label>
              <div className="calender_spot"></div>
            </div>
            <div className="calender_item">
              <input type="radio" id="radio104" name="day1" />
              <label htmlFor="radio104">Thu</label>
              <div className="calender_spot"></div>
            </div>
            <div className="calender_item">
              <input type="radio" id="radio105" name="day1" />
              <label htmlFor="radio105">Fri</label>
              <div className="calender_spot"></div>
            </div>
            <div className="calender_item">
              <input type="radio" id="radio106" name="day1" />
              <label htmlFor="radio106">Sat</label>
              <div className="calender_spot"></div>
            </div>
            <div className="calender_item">
              <input type="radio" id="radio107" name="day1" />
              <label htmlFor="radio107">Sun</label>
              <div className="calender_spot"></div>
            </div>
          </div>
          <label htmlFor="email" className="mt-2">
            Time Range
          </label>
          <div className="cs-form time_picker d-flex gap-3 align-items-center py-3">
            <InputField
              type="time"
              id="time"
              placeholder="25min to 30min"
              classInput="classInput"
            />
            <span>To</span>
            <InputField
              type="time"
              id="time"
              placeholder="25min to 30min"
              classInput="classInput"
            />
          </div>
        </div>

        <div className="space_div"></div>
        <AuthBtn title="Next" type="button" onClick={handleLogin} />
      </fieldset>
    </form>
  );
}

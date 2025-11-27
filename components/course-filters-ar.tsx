"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, Filter, X } from "lucide-react";
import { useTranslation } from "react-i18next";

interface CourseFiltersProps {
  onFilterChange: (filters: {
    city: string;
    section: string;
    search: string;
  }) => void;
}

export default function CourseFiltersAr({
  onFilterChange,
}: CourseFiltersProps) {
  const { i18n } = useTranslation();
  const lang = i18n.language || "ar";

  const isArabic = lang === "ar";

  // --- Translations embedded directly ---
  const t = useMemo(() => {
    const translations = {
      ar: {
        title: "فلترة الدورات",
        searchPlaceholder: "ابحث عن دورة...",
        cityPlaceholder: "اختر المدينة",
        sectionPlaceholder: "اختر القسم",
        clearFilters: "مسح الفلاتر",
        activeFilters: "الفلاتر النشطة:",
        cityLabel: "المدينة",
        sectionLabel: "القسم",
        searchLabel: "البحث",
        cities: [
          "جميع المدن",
          "لندن",
          "دبي",
          "اسطنبول",
          "باريس",
          "روما",
          "برشلونة",
          "مدريد",
          "البندقية",
        ],
        sections: [
          "جميع الأقسام",
          "التواصل المؤسسي",
          "المراسم والاتكيت",
          "الإدارة الإعلامية",
          "التسويق والعلامة التجارية",
          "الذكاء الاصطناعي",
          "التصميم والمونتاج",
        ],
      },
      en: {
        title: "Filter Courses",
        searchPlaceholder: "Search for a course...",
        cityPlaceholder: "Select a city",
        sectionPlaceholder: "Select a section",
        clearFilters: "Clear Filters",
        activeFilters: "Active filters:",
        cityLabel: "City",
        sectionLabel: "Section",
        searchLabel: "Search",
        cities: [
          "All Cities",
          "London",
          "Dubai",
          "Istanbul",
          "Paris",
          "Rome",
          "Barcelona",
          "Madrid",
          "Venice",
        ],
        sections: [
          "All Sections",
          "Corporate Communication",
          "Protocol & Etiquette",
          "Media Management",
          "Marketing & Branding",
          "Artificial Intelligence",
          "Design & Editing",
        ],
      },
    };
    return translations[lang as "ar" | "en"];
  }, [lang]);

  const searchParams = useSearchParams();
  const router = useRouter();

  const [selectedCity, setSelectedCity] = useState(t.cities[0]);
  const [selectedSection, setSelectedSection] = useState(t.sections[0]);
  const [searchTerm, setSearchTerm] = useState("");

  // Initialize filters from URL
  useEffect(() => {
    const cityParam = searchParams.get("city");
    const sectionParam = searchParams.get("section");
    const searchParam = searchParams.get("search");

    let initialCity = t.cities[0];
    let initialSection = t.sections[0];
    let initialSearch = "";

    if (cityParam && t.cities.includes(cityParam)) initialCity = cityParam;
    if (sectionParam && t.sections.includes(sectionParam))
      initialSection = sectionParam;
    if (searchParam) initialSearch = searchParam;

    setSelectedCity(initialCity);
    setSelectedSection(initialSection);
    setSearchTerm(initialSearch);

    onFilterChange({
      city: initialCity,
      section: initialSection,
      search: initialSearch,
    });
  }, [lang]); // Re-run when language changes

  const updateURL = (city: string, section: string, search: string) => {
    const params = new URLSearchParams();
    if (city !== t.cities[0]) params.set("city", city);
    if (section !== t.sections[0]) params.set("section", section);
    if (search) params.set("search", search);

    const newURL = params.toString()
      ? `/ar/courses?${params.toString()}`
      : "/ar/courses";
    router.push(newURL, { scroll: false });
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    updateURL(city, selectedSection, searchTerm);
    onFilterChange({ city, section: selectedSection, search: searchTerm });
  };

  const handleSectionChange = (section: string) => {
    setSelectedSection(section);
    updateURL(selectedCity, section, searchTerm);
    onFilterChange({ city: selectedCity, section, search: searchTerm });
  };

  const handleSearchChange = (search: string) => {
    setSearchTerm(search);
    updateURL(selectedCity, selectedSection, search);
    onFilterChange({ city: selectedCity, section: selectedSection, search });
  };

  const clearFilters = () => {
    setSelectedCity(t.cities[0]);
    setSelectedSection(t.sections[0]);
    setSearchTerm("");
    router.push("/ar/courses", { scroll: false });
    onFilterChange({ city: t.cities[0], section: t.sections[0], search: "" });
  };

  return (
    <Card
      dir={isArabic ? "rtl" : "ltr"}
      className="mb-8 border shadow-lg bg-gradient-to-r from-royal-50 to-crimson-50 dark:from-gray-800 dark:to-gray-900 border-royal-200 dark:border-gray-700"
    >
      <CardContent className="p-6">
        <div
          className={`flex items-center gap-2 mb-6 ${
            isArabic ? "flex-row-reverse" : ""
          }`}
        >
          <Filter className="w-5 h-5 text-royal-500 dark:text-royal-400" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {t.title}
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {/* Search Input */}
          <div className="relative">
            <Search
              className={`absolute ${
                isArabic ? "right-3" : "left-3"
              } top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500`}
            />
            <Input
              placeholder={t.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className={`${
                isArabic ? "pr-10 text-right" : "pl-10 text-left"
              } bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400`}
            />
          </div>

          {/* City Selector */}
          <Select value={selectedCity} onValueChange={handleCityChange}>
            <SelectTrigger className="bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <SelectValue placeholder={t.cityPlaceholder} />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
              {t.cities.map((city) => (
                <SelectItem
                  key={city}
                  value={city}
                  className="dark:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700"
                >
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Section Selector */}
          <Select value={selectedSection} onValueChange={handleSectionChange}>
            <SelectTrigger className="bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <SelectValue placeholder={t.sectionPlaceholder} />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
              {t.sections.map((section) => (
                <SelectItem
                  key={section}
                  value={section}
                  className="dark:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700"
                >
                  {section}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Clear Button */}
          <Button
            variant="outline"
            onClick={clearFilters}
            className={`flex items-center gap-2 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 dark:text-white ${
              isArabic ? "flex-row-reverse" : ""
            }`}
          >
            <X className="w-4 h-4" />
            {t.clearFilters}
          </Button>
        </div>

        {/* Active Filters */}
        {(selectedCity !== t.cities[0] ||
          selectedSection !== t.sections[0] ||
          searchTerm) && (
          <div
            className={`mt-4 flex flex-wrap gap-2 ${
              isArabic ? "justify-end text-right" : "justify-start text-left"
            }`}
          >
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {t.activeFilters}
            </span>
            {selectedCity !== t.cities[0] && (
              <span className="px-3 py-1 text-sm rounded-full bg-royal-100 text-royal-700 dark:bg-royal-900 dark:text-royal-300">
                {t.cityLabel}: {selectedCity}
              </span>
            )}
            {selectedSection !== t.sections[0] && (
              <span className="px-3 py-1 text-sm rounded-full bg-royal-100 text-royal-700 dark:bg-royal-900 dark:text-royal-300">
                {t.sectionLabel}: {selectedSection}
              </span>
            )}
            {searchTerm && (
              <span className="px-3 py-1 text-sm rounded-full bg-royal-100 text-royal-700 dark:bg-royal-900 dark:text-royal-300">
                {t.searchLabel}: {searchTerm}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
